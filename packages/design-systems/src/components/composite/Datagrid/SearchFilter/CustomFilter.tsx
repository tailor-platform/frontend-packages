import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  ForwardedRef,
  useRef,
} from "react";
import { Box } from "../../../patterns/Box";
import { Button } from "../../../Button";
import {
  CustomFilterProps,
  FilterRowData,
  FilterRowState,
  GraphQLQueryFilter,
  JointCondition,
} from "../types";
import { jointConditions } from "../data/filter";
import { FilterRow } from "./FilterRow";

export const CustomFilter = forwardRef(
  <TData extends Record<string, unknown>>(
    props: CustomFilterProps<TData>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { columns, onChange, localization, isVisible, defaultFilter } = props;
    const [filterRowsState, setFilterRowsState] = useState<GraphQLQueryFilter>(
      defaultFilter || {},
    );
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
      (props: {
        index: number;
        isFirstRow: boolean;
        existDefaultFilter: boolean;
      }): FilterRowData<TData> => ({
        columns: columns,
        index: props.index,
        localization: localization,
        isFirstRow: props.isFirstRow,
        jointConditions: activeJointConditions,
        currentState: {
          column: "",
          condition: "",
          value: "",
          jointCondition: props.existDefaultFilter ? "and" : "",
          isDefault: false,
          isChangeable: props.existDefaultFilter ? false : true,
        },
      }),
      [localization, columns, activeJointConditions],
    );

    const convertQueryToFilterRows = useCallback(
      (filter: GraphQLQueryFilter): FilterRowData<TData>[] => {
        const filterRows: FilterRowData<TData>[] = [];
        const convertQueryToFilterRowsRecursively = (
          filter: GraphQLQueryFilter,
          jointCondition: string | undefined,
          index: number,
        ) => {
          const keys = Object.keys(filter);
          keys.forEach((key) => {
            if (key === "and" || key === "or") {
              const jointConditionValue = filter[key];
              convertQueryToFilterRowsRecursively(
                jointConditionValue as GraphQLQueryFilter,
                key,
                index + 1,
              );
            } else {
              const column = key;
              const condition = Object.keys(filter[key])[0];
              const value: string = filter[key][condition] as string;
              const isFirstRow = index === 0;
              const currentState: FilterRowState = {
                column: column,
                condition: condition,
                value: value,
                jointCondition: jointCondition,
                isDefault: true,
                isChangeable: false,
              };
              filterRows.push({
                columns: columns,
                index: index,
                localization: localization,
                isFirstRow: isFirstRow,
                jointConditions: activeJointConditions,
                currentState: currentState,
              });
            }
          });
        };
        convertQueryToFilterRowsRecursively(filter, undefined, 0);
        return filterRows;
      },
      [localization, columns, activeJointConditions],
    );

    const defaultFilterRows: FilterRowData<TData>[] = useMemo(() => {
      const filterRows: FilterRowData<TData>[] = [];
      if (defaultFilter) {
        filterRows.push(...convertQueryToFilterRows(defaultFilter));
      }
      filterRows.push(
        newEmptyRow({
          index: filterRows.length,
          isFirstRow: true,
          existDefaultFilter: !!defaultFilter,
        }),
      );
      return filterRows;
    }, [defaultFilter, newEmptyRow, convertQueryToFilterRows]);

    /**
     * In cases where there is no default filter, start with 1 filter row initially .
     * This will be incremented when user clicks on "Add new filter" button.
     * This will be used to generate unique index for each filter row.
     * We cant use filterRows.length as it will grow and shrink based on user actions and might not produce the unique keys.
     */
    const [numberOfFilterRows, setNumberOfFilterRows] = useState(
      defaultFilterRows.length,
    );

    const [filterRows, setFilterRows] =
      useState<FilterRowData<TData>[]>(defaultFilterRows);

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
      setFilterRows(defaultFilterRows);
      setFilterRowsState(defaultFilter || {});
      setSelectedJointCondition(undefined);
      setNumberOfFilterRows(defaultFilterRows.length);
    }, [defaultFilter, defaultFilterRows]);

    /**
     * This will add new item to filterRows data state.
     */
    const addNewFilterRowHandler = useCallback(
      (newRowIndex: number) => {
        setFilterRows((oldState) => {
          const newState = [...oldState];
          newState.push(
            newEmptyRow({
              index: newRowIndex,
              isFirstRow: false,
              existDefaultFilter: !!defaultFilter,
            }),
          );
          return newState;
        });
      },
      [newEmptyRow, defaultFilter],
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

    const prevFilter = usePrevious(filterRowsState);

    /**
     * This will bubble up the GraphQLQueryFilter to the parent component.
     */
    useEffect(() => {
      const filterChange = () => {
        if (filterRowsState !== prevFilter.current) {
          onChange(filterRowsState);
        }
      };
      filterChange();
      // We have to run this function only when filterRowState changes, but this way of writing will cause an error due to lint rules, so we excluded it here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterRowsState]);

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
        top={"100px"}
        backgroundColor={"bg.default"}
        zIndex={2}
        ref={ref}
        display={isVisible ? "block" : "none"}
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
            if (row.currentState.isDefault === true) {
              return null;
            }
            return (
              <FilterRow
                key={"filterRow" + row.index}
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
          backgroundColor="primary.default"
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
  },
);

CustomFilter.displayName = "CustomFilter";

const usePrevious = (value: GraphQLQueryFilter) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
