import { Button } from "@tailor-platform/design-systems";
import { Box } from "@tailor-platform/styled-system/jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterRow } from "./FilterRow";
import {
  CustomFilterProps,
  FilterRowData,
  FilterRowState,
  GraphQLQueryFilter,
  JointCondition,
} from "@types";
import { jointConditions } from "../data/filter";

export const CustomFilter = <TData extends Record<string, unknown>>(
  props: CustomFilterProps<TData>,
) => {
  const { columns, onChange, localization } = props;
  const [filterRowsState, setFilterRowsState] = useState<GraphQLQueryFilter>(
    {},
  );
  /**
   * Always start with 1 filter row initially.
   * This will be incremented when user clicks on "Add new filter" button.
   * This will be used to generate unique index for each filter row.
   * We cant use filterRows.length as it will grow and shrink based on user actions and might not produce the unique keys.
   */
  const [numberOfFilterRows, setNumberOfFilterRows] = useState(1);
  const [selectedJointCondition, setSelectedJointCondition] = useState<
    string | undefined
  >(undefined);
  /*
   * This will disable the joint conditions which are not selected in the first row.
   * For example, if user selects "and" in the first row, then "or" will be disabled in the second row and onwards.
   */
  const activeJointConditions = useMemo(() => {
    if (selectedJointCondition) {
      return jointConditions.map((jointCondition: JointCondition) => {
        if (jointCondition.value === selectedJointCondition) {
          return jointCondition;
        } else {
          return { ...jointCondition, disabled: true };
        }
      });
    } else {
      return jointConditions;
    }
  }, [selectedJointCondition]);

  const newEmptyRow = useCallback(
    (props: { index: number; isFirstRow: boolean }) => ({
      columns: columns,
      index: props.index,
      localization: localization,
      isFirstRow: props.isFirstRow,
      jointConditions: activeJointConditions,
      currentState: {
        column: "",
        condition: "",
        value: "",
        jointCondition: "",
      },
    }),
    [localization, columns, activeJointConditions],
  );

  const [filterRows, setFilterRows] = useState<FilterRowData<TData>[]>([
    newEmptyRow({ index: 0, isFirstRow: true }),
  ]);

  /**
   * This will delete the filter row from filterRows.
   */
  const deleteFilterRowHandler = useCallback(
    (rowIndex: number) => () => {
      setFilterRows((state) => {
        return state.filter((row) => {
          return rowIndex !== row.index;
        });
      });
    },
    [],
  );

  /**
   * This will convert the FilterRowState object from the UI to GraphQLQueryFilter and add it to the GraphQLQueryFilter.
   */
  const filterChangedHandler = useCallback(
    (index: number) => (currentFilter: FilterRowState) => {
      if (currentFilter.jointCondition) {
        setSelectedJointCondition(currentFilter.jointCondition);
      }
      setFilterRows((oldState) => {
        const newState = [...oldState];
        const row = newState.find((row) => row.index === index);
        if (row) {
          row.currentState = currentFilter;
        }
        return newState;
      });
    },
    [],
  );

  /**
   * This will reset the filterRows data state.
   */
  const resetFilterHandler = useCallback(() => {
    setFilterRows([newEmptyRow({ index: 0, isFirstRow: true })]);
    setFilterRowsState({});
    setSelectedJointCondition(undefined);
  }, [newEmptyRow]);

  /**
   * This will add new item to filterRows data state.
   */
  const addNewFilterRowHandler = useCallback(
    (newRowIndex: number) => {
      setFilterRows((oldState) => {
        const newState = [...oldState];
        newState.push(newEmptyRow({ index: newRowIndex, isFirstRow: false }));
        return newState;
      });
    },
    [newEmptyRow],
  );

  /**
   * This will update the joint conditions of all FilterRows when the joint condition changes.
   * Phase1: User can only select only all "and" or only all "or".
   */
  useEffect(() => {
    if (!activeJointConditions) {
      return;
    }
    setFilterRows((oldState) => {
      const newState = [...oldState];
      return newState.map((row) => {
        row.jointConditions = activeJointConditions;
        return row;
      });
    });
  }, [activeJointConditions]);

  /**
   * This will bubble up the GraphQLQueryFilter to the parent component.
   */
  useEffect(() => {
    onChange(filterRowsState);
  }, [filterRowsState, onChange]);

  /**
   *
   *  This will recursively add the filter to GraphQLQueryFilter to create objects like this:
   *
    {
        "status": {
            "eq": "pending"
        },
        "or": {
            "status": {
                "eq": "processing"
            },
            "or": {
                "status": {
                    "eq": "success"
                },
                "or": {
                    "status": {
                        "eq": "failed"
                    }
                }
            }
        }
      }
  */
  const addToGraphQLQueryFilterRecursively = useCallback(
    (filter: FilterRowState, graphQLQueryObject: GraphQLQueryFilter) => {
      const { column, condition, value, jointCondition } = filter;
      if (column && condition && value) {
        if (jointCondition) {
          if (graphQLQueryObject[jointCondition]) {
            addToGraphQLQueryFilterRecursively(
              filter,
              graphQLQueryObject[jointCondition] as GraphQLQueryFilter,
            );
          } else {
            graphQLQueryObject[jointCondition] = {
              [column]: {
                [condition]: value,
              },
            };
          }
        } else {
          //First row will not have joint condition
          graphQLQueryObject[column] = {
            [condition]: value,
          };
        }
      }
    },
    [],
  );

  /**
   * This will update the GraphQLQueryFilter when filterRows data state changes.
   */
  useEffect(() => {
    //Create GraphQLQueryFilter from filterRows
    const newFilterRowsState: GraphQLQueryFilter = {};
    filterRows.forEach((row) => {
      if (row.currentState) {
        const { column, condition, value } = row.currentState;
        if (column && condition && value) {
          addToGraphQLQueryFilterRecursively(
            row.currentState,
            newFilterRowsState,
          );
        }
      }
    });
    setFilterRowsState(newFilterRowsState);
  }, [addToGraphQLQueryFilterRecursively, filterRows]);

  return (
    <Box
      px={4}
      pb={4}
      borderRadius={"4px"}
      boxShadow="lg"
      position={"absolute"}
      backgroundColor={"bg.default"}
    >
      <Button
        variant="tertiary"
        onClick={resetFilterHandler}
        color={"error.default"}
        data-testid={"reset-filter-button"}
      >
        {localization.filter.filterResetLabel}
      </Button>
      <Box
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-end"}
      >
        {filterRows.map((row) => {
          return (
            <FilterRow
              key={row.index}
              currentFilter={row.currentState}
              columns={columns}
              jointConditions={activeJointConditions}
              onDelete={deleteFilterRowHandler(row.index)}
              isFirstRow={row.isFirstRow}
              onChange={filterChangedHandler(row.index)}
              localization={localization}
            />
          );
        })}
      </Box>
      <Button
        backgroundColor="accent.default"
        marginTop={4}
        onClick={() => {
          addNewFilterRowHandler(numberOfFilterRows);
          setNumberOfFilterRows((prev) => prev + 1);
        }}
      >
        {localization.filter.addNewFilterLabel}
      </Button>
    </Box>
  );
};
