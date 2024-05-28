import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  CSSProperties,
} from "react";
import dayjs from "dayjs";
import type { GraphQLQueryFilter } from "..";
import type { Column, MetaType } from "../types";
import { jointConditions } from "./filter";
import { FilterRowState, JointCondition } from "./types";

export type FilterRowData = {
  index: number; //Row number
  currentState: FilterRowState;
};

type UseCustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter) => void;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
};

export const useCustomFilter = <TData>({
  columns,
  onChange,
  systemFilter,
  defaultFilter,
}: UseCustomFilterProps<TData>) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

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
    (props: { index: number; existSystemFilter: boolean }): FilterRowData => ({
      index: props.index,
      currentState: {
        column: "",
        condition: "",
        value: "",
        jointCondition: props.existSystemFilter ? "and" : "",
        isSystem: false,
        isChangeable: props.existSystemFilter ? false : true,
      },
    }),
    [],
  );

  const convertQueryToFilterRows = useCallback(
    (
      filter: GraphQLQueryFilter,
      isSystem: boolean,
      filterRowIndex: number,
    ): FilterRowData[] => {
      const filterRows: FilterRowData[] = [];
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
            const currentState: FilterRowState = {
              column: column,
              condition: condition,
              value: value,
              jointCondition: jointCondition,
              isSystem: isSystem,
              isChangeable: false,
            };
            filterRows.push({
              index: index,
              currentState: currentState,
            });
          }
        });
      };
      convertQueryToFilterRowsRecursively(
        filter,
        filterRowIndex === 0 ? "and" : undefined, // First row will have "and" as joint condition.
        filterRowIndex,
      );
      return filterRows;
    },
    [],
  );

  const systemFilterRows: FilterRowData[] = useMemo(() => {
    const filterRows: FilterRowData[] = [];
    if (systemFilter) {
      filterRows.push(...convertQueryToFilterRows(systemFilter, true, 0));
    }
    filterRows.push(
      newEmptyRow({
        index: filterRows.length,
        existSystemFilter: !!systemFilter,
      }),
    );
    return filterRows;
  }, [systemFilter, newEmptyRow, convertQueryToFilterRows]);

  const initialFilterRows: FilterRowData[] = useMemo(() => {
    const filterRows: FilterRowData[] = [];
    if (systemFilter) {
      filterRows.push(...convertQueryToFilterRows(systemFilter, true, 0));
    }
    if (defaultFilter) {
      filterRows.push(
        ...convertQueryToFilterRows(defaultFilter, false, filterRows.length),
      );
    }
    filterRows.push(
      newEmptyRow({
        index: filterRows.length,
        existSystemFilter: !!systemFilter,
      }),
    );
    return filterRows;
  }, [systemFilter, defaultFilter, newEmptyRow, convertQueryToFilterRows]);

  const [filterRows, setFilterRows] =
    useState<FilterRowData[]>(initialFilterRows);

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
   * This will reset the filterRows data state.
   */
  const resetFilterHandler = useCallback(() => {
    setFilterRows(initialFilterRows);
    setSelectedJointCondition(undefined);
  }, [initialFilterRows]);

  /**
   * This will reset the filterRows data state.
   */
  const clearFilterHandler = useCallback(() => {
    setFilterRows(systemFilterRows);
    setSelectedJointCondition(undefined);
  }, [systemFilterRows]);

  /**
   * This will add new item to filterRows data state.
   */
  const addNewFilterRowHandler = useCallback(() => {
    setFilterRows((oldState) => {
      const newState = [...oldState];
      newState.push(
        newEmptyRow({
          index: oldState.length,
          existSystemFilter: !!systemFilter,
        }),
      );
      return newState;
    });
  }, [newEmptyRow, systemFilter]);

  /**
   *
   *  This will recursively add the filter to GraphQLQueryFilter to create objects like this:
   *
    {
        "and": {
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
    (
      filter: FilterRowState,
      graphQLQueryObject: GraphQLQueryFilter,
      metaType: MetaType | undefined,
    ) => {
      const { column, condition, value, jointCondition } = filter;

      const generateGraphQLQueryObject = (
        isExitJointCondition: boolean,
        value: string | boolean | number,
      ) => {
        if (isExitJointCondition) {
          return {
            [column]: {
              [condition]: value,
            },
          };
        }
        return {
          [condition]: value,
        };
      };

      const assignValueToQueryObject = (
        key: string,
        isExitJointCondition: boolean,
      ) => {
        if (typeof value === "boolean" || typeof value === "number") {
          graphQLQueryObject[key] = generateGraphQLQueryObject(
            isExitJointCondition,
            value,
          );
          return;
        }
        switch (metaType) {
          case "boolean":
            graphQLQueryObject[key] = generateGraphQLQueryObject(
              isExitJointCondition,
              value.toLowerCase() === "true",
            );
            break;
          case "dateTime": {
            const date = dayjs(value);
            if (!date.isValid()) {
              throw new Error("Invalid date format.");
            }
            graphQLQueryObject[key] = generateGraphQLQueryObject(
              isExitJointCondition,
              new Date(value).toISOString(),
            );
            break;
          }
          case "number":
            graphQLQueryObject[key] = generateGraphQLQueryObject(
              isExitJointCondition,
              Number(value),
            );
            break;
          case "enum":
          case "string":
          default:
            graphQLQueryObject[key] = generateGraphQLQueryObject(
              isExitJointCondition,
              value,
            );
            break;
        }
      };

      if (jointCondition) {
        if (graphQLQueryObject[jointCondition]) {
          addToGraphQLQueryFilterRecursively(
            filter,
            graphQLQueryObject[jointCondition] as GraphQLQueryFilter,
            metaType,
          );
        } else {
          assignValueToQueryObject(jointCondition, true);
        }
      } else {
        //First row will not have joint condition
        assignValueToQueryObject(column, false);
      }
    },
    [],
  );

  const generateGraphQLQueryFilter = useCallback(
    (currentFilterRows: FilterRowData[]) => {
      const newGraphQLQueryFilter: GraphQLQueryFilter = {};
      currentFilterRows.forEach((row) => {
        if (row.currentState) {
          const { column, condition, value } = row.currentState;
          const metaType = columns.find((c) => c.accessorKey === column)?.meta
            ?.type;
          const isExistCurrentState: boolean =
            (!!column && !!condition && !!value) ||
            (typeof value === "boolean" && value === false);
          if (isExistCurrentState) {
            addToGraphQLQueryFilterRecursively(
              row.currentState,
              newGraphQLQueryFilter,
              metaType,
            );
          }
        }
      });
      return newGraphQLQueryFilter;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [addToGraphQLQueryFilterRecursively, columns],
  );

  const [prevFilter, setPrevFilter] = useState<GraphQLQueryFilter>({});

  /**
   * This will bubble up the GraphQLQueryFilter to the parent component.
   */
  useEffect(() => {
    const filter = generateGraphQLQueryFilter(filterRows);
    if (JSON.stringify(prevFilter) !== JSON.stringify(filter)) {
      onChange(filter);
      setPrevFilter(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRows]);

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

  const getBoxPosition = (): CSSProperties => {
    const box = filterButtonRef.current?.getBoundingClientRect();

    if (!box) {
      return {};
    }
    return {
      zIndex: 1500, // ark-ui modal has z-index of 1400. So, we need to set it higher than that.
      position: "fixed",
      top: Math.ceil(box.bottom),
    };
  };

  return {
    filterRef,
    filterButtonRef,
    filterRows,
    activeJointConditions,
    deleteFilterRowHandler,
    resetFilterHandler,
    clearFilterHandler,
    addNewFilterRowHandler,
    filterChangedHandler,
    getBoxPosition,
    addToGraphQLQueryFilterRecursively, // For testing purpose
    convertQueryToFilterRows, // For testing purpose
    generateGraphQLQueryFilter, // For testing purpose
    initialFilterRows, // For testing purpose
    setPrevFilter, // For testing purpose
  };
};
