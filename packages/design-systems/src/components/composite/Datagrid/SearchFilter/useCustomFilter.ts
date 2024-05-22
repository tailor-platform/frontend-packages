import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  CSSProperties,
} from "react";
import dayjs from "dayjs";
import type { GraphQLQueryFilter, Localization } from "..";
import type { Column, MetaType } from "../types";
import { jointConditions } from "./filter";
import { FilterRowState, JointCondition } from "./types";

export type FilterRowData<TData> = {
  columns: Array<Column<TData>>;
  index: number; //Row number
  localization: Localization;
  isFirstRow: boolean;
  jointConditions: JointCondition[];
  currentState: FilterRowState;
};

const usePrevious = (value: GraphQLQueryFilter) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

type UseCustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter) => void;
  localization: Localization;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
};

export const useCustomFilter = <TData>({
  columns,
  onChange,
  localization,
  systemFilter,
  defaultFilter,
}: UseCustomFilterProps<TData>) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const combineGlaphQLQueryFilter = useCallback(
    ({
      systemFilter,
      defaultFilter,
    }: {
      systemFilter?: GraphQLQueryFilter;
      defaultFilter?: GraphQLQueryFilter;
    }): GraphQLQueryFilter => {
      if (systemFilter && defaultFilter) {
        const combineGlaphQLQueryFilterRecursively = (
          systemFilter: GraphQLQueryFilter,
          defaultFilter: GraphQLQueryFilter,
        ): GraphQLQueryFilter => {
          const keys = Object.keys(systemFilter);
          const newFilter: GraphQLQueryFilter = { ...systemFilter };
          keys.forEach((key) => {
            if (key === "and" || key === "or") {
              newFilter[key] = combineGlaphQLQueryFilterRecursively(
                systemFilter[key] as GraphQLQueryFilter,
                defaultFilter,
              );
            } else {
              newFilter["and"] = defaultFilter;
            }
          });
          return newFilter;
        };
        const newQuery = combineGlaphQLQueryFilterRecursively(
          systemFilter,
          defaultFilter,
        );
        return newQuery;
      } else {
        return systemFilter || defaultFilter || {};
      }
    },
    [],
  );

  const initialFilter = useMemo(
    () => combineGlaphQLQueryFilter({ systemFilter, defaultFilter }),
    [combineGlaphQLQueryFilter, systemFilter, defaultFilter],
  );

  const [filterRowsState, setFilterRowsState] = useState<GraphQLQueryFilter>(
    initialFilter || {},
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
      existSystemFilter: boolean;
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
        jointCondition: props.existSystemFilter ? "and" : "",
        isSystem: false,
        isChangeable: props.existSystemFilter ? false : true,
      },
    }),
    [localization, columns, activeJointConditions],
  );

  const convertQueryToFilterRows = useCallback(
    (
      filter: GraphQLQueryFilter,
      isSystem: boolean,
      filterRowIndex: number,
    ): FilterRowData<TData>[] => {
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
            const isFirstRow = index === filterRowIndex;
            const currentState: FilterRowState = {
              column: column,
              condition: condition,
              value: value,
              jointCondition: jointCondition,
              isSystem: isSystem,
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
      convertQueryToFilterRowsRecursively(
        filter,
        filterRowIndex === 0 ? undefined : "and",
        filterRowIndex,
      );
      return filterRows;
    },
    [localization, columns, activeJointConditions],
  );

  const systemFilterRows: FilterRowData<TData>[] = useMemo(() => {
    const filterRows: FilterRowData<TData>[] = [];
    if (systemFilter) {
      filterRows.push(...convertQueryToFilterRows(systemFilter, true, 0));
    }
    filterRows.push(
      newEmptyRow({
        index: filterRows.length,
        isFirstRow: true,
        existSystemFilter: !!systemFilter,
      }),
    );
    return filterRows;
  }, [systemFilter, newEmptyRow, convertQueryToFilterRows]);

  const initialFilterRows: FilterRowData<TData>[] = useMemo(() => {
    const filterRows: FilterRowData<TData>[] = [];
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
        isFirstRow: !defaultFilter,
        existSystemFilter: !!systemFilter,
      }),
    );
    return filterRows;
  }, [systemFilter, defaultFilter, newEmptyRow, convertQueryToFilterRows]);

  /**
   * In cases where there is no default filter, start with 1 filter row initially .
   * This will be incremented when user clicks on "Add new filter" button.
   * This will be used to generate unique index for each filter row.
   * We cant use filterRows.length as it will grow and shrink based on user actions and might not produce the unique keys.
   */
  const [numberOfFilterRows, setNumberOfFilterRows] = useState(
    initialFilterRows.length,
  );

  const [filterRows, setFilterRows] =
    useState<FilterRowData<TData>[]>(initialFilterRows);

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
    setFilterRowsState(initialFilter || {});
    setSelectedJointCondition(undefined);
    setNumberOfFilterRows(initialFilterRows.length);
  }, [initialFilter, initialFilterRows]);

  /**
   * This will reset the filterRows data state.
   */
  const clearFilterHandler = useCallback(() => {
    setFilterRows(systemFilterRows);
    setFilterRowsState(systemFilter || {});
    setSelectedJointCondition(undefined);
    setNumberOfFilterRows(systemFilterRows.length);
  }, [systemFilter, systemFilterRows]);

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
            existSystemFilter: !!systemFilter,
          }),
        );
        return newState;
      });
    },
    [newEmptyRow, systemFilter],
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

  /**
   * This will update the GraphQLQueryFilter when filterRows data state changes.
   */
  useEffect(() => {
    //Create GraphQLQueryFilter from filterRows
    const newFilterRowsState: GraphQLQueryFilter = {};
    filterRows.forEach((row) => {
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
            newFilterRowsState,
            metaType,
          );
        }
      }
    });
    setFilterRowsState(newFilterRowsState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToGraphQLQueryFilterRecursively, filterRows]);

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
    numberOfFilterRows,
    setNumberOfFilterRows,
  };
};
