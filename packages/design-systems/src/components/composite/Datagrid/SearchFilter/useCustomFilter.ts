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

export type FilterRowData = {
  index: number; //Row number
  currentState: FilterRowState;
};

type UseCustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter | undefined) => void;
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
    (props: { index: number; isChangeable: boolean }): FilterRowData => ({
      index: props.index,
      currentState: {
        column: "",
        condition: "",
        value: "",
        jointCondition: selectedJointCondition,
        isChangeable: props.isChangeable,
      },
    }),
    [selectedJointCondition],
  );

  const convertQueryToFilterRows = useCallback(
    (filter: GraphQLQueryFilter, filterRowIndex: number): FilterRowData[] => {
      const filterRows = Object.entries(filter).flatMap(
        ([column, filterRow]) => {
          if (Array.isArray(filterRow)) {
            return [];
          }
          const [condition, value] = Object.entries(filterRow)[0];
          const currentState: FilterRowState = {
            column,
            condition,
            value: value as string,
            jointCondition: undefined,
            isChangeable: true,
          };
          return [
            {
              index: filterRowIndex,
              currentState,
            },
          ];
        },
      );
      return filterRows;
    },
    [],
  );

  const initialFilterRows = useCallback((): FilterRowData[] => {
    const filterRows: FilterRowData[] = [];
    if (defaultFilter) {
      filterRows.push(
        ...convertQueryToFilterRows(defaultFilter, filterRows.length),
      );
    }

    filterRows.push(
      newEmptyRow({
        index: filterRows.length,
        isChangeable: true, // At this point, the user has not specified jointCondition, so it can be changed
      }),
    );
    return filterRows;
  }, [convertQueryToFilterRows, defaultFilter, newEmptyRow]);

  const [filterRows, setFilterRows] =
    useState<FilterRowData[]>(initialFilterRows());

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
    setFilterRows([newEmptyRow({ index: 0, isChangeable: true })]);
    setSelectedJointCondition(undefined);
  }, [newEmptyRow]);

  /**
   * This will add new item to filterRows data state.
   */
  const addNewFilterRowHandler = useCallback(() => {
    setFilterRows((oldState) => {
      const newState = [...oldState];
      newState.push(
        newEmptyRow({
          index: oldState.length,
          isChangeable: selectedJointCondition ? false : true,
        }),
      );
      return newState;
    });
  }, [newEmptyRow, selectedJointCondition]);

  /**
   *
   *  This will recursively add the filter to GraphQLQueryFilter to create objects like this:
   *
    {
        "and": {
            "status": {
                "eq": "processing"
            },
            "or": [
               "status": {
                 "eq": "success"
               },
               "status": {
                 "eq": "failed"
               }
            ]
        }
      }
  */
  const convertQueryFilter = useCallback(
    (
      filter: FilterRowState,
      graphQLQueryObject: GraphQLQueryFilter,
      metaType: MetaType | undefined,
      localization: Localization,
    ) => {
      const { column, condition, value, jointCondition } = filter;

      const generateGraphQLQueryObject = (
        value: string | boolean | number | string[] | number[],
      ) => {
        return {
          [column]: {
            [condition]: value,
          },
        };
      };

      const valueCoveter = (
        metaType: MetaType | undefined,
        value: string | boolean | number | string[] | number[],
      ) => {
        if (typeof value === "boolean" || typeof value === "number") {
          return value;
        }

        if (Array.isArray(value)) {
          if (typeof value[0] === "string" && metaType === "number") {
            return value.map((v) => Number(v));
          }
          return value;
        }

        switch (metaType) {
          case "boolean":
            return (
              value.toLowerCase() === localization.filter.columnBoolean.true
            );
          case "dateTime": {
            const date = dayjs(value);
            if (!date.isValid()) {
              throw new Error("Invalid date format.");
            }
            return new Date(value).toISOString();
          }
          case "number":
            if (Array.isArray(value)) {
              return value.map((v) => Number(v));
            }
            return Number(value);
          case "enum":
          case "string":
          default:
            return value;
        }
      };

      if (jointCondition) {
        const filterRow = graphQLQueryObject[jointCondition];

        if (filterRow && Array.isArray(filterRow)) {
          filterRow.push(
            generateGraphQLQueryObject(valueCoveter(metaType, value)),
          );
        } else {
          graphQLQueryObject[jointCondition] = [
            generateGraphQLQueryObject(valueCoveter(metaType, value)),
          ];
        }
      } else {
        graphQLQueryObject[column] = {
          [condition]: valueCoveter(metaType, value),
        };
      }
    },
    [],
  );

  /**
   * This will convert the FilterRowState object from the UI to GraphQLQueryFilter and add it to the GraphQLQueryFilter.
   */
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
            convertQueryFilter(
              row.currentState,
              newGraphQLQueryFilter,
              metaType,
              localization,
            );
          }
        }
      });

      if (isEmpty(systemFilter) && isEmpty(newGraphQLQueryFilter)) {
        return undefined;
      }
      return {
        and: {
          ...systemFilter,
          ...newGraphQLQueryFilter,
        },
      };
    },
    [systemFilter, columns, convertQueryFilter, localization],
  );

  const [prevFilter, setPrevFilter] = useState<GraphQLQueryFilter>({});

  /**
   * This will bubble up the GraphQLQueryFilter to the parent component.
   */
  useEffect(() => {
    const filter = generateGraphQLQueryFilter(filterRows);
    if (JSON.stringify(prevFilter) !== JSON.stringify(filter)) {
      onChange(filter);
      setPrevFilter(filter ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRows]);

  const filterChangedHandler = useCallback(
    (index: number) => (currentFilter: FilterRowState) => {
      if (currentFilter.jointCondition) {
        setSelectedJointCondition(currentFilter.jointCondition);
        // 一度jointConditionを変更したら、ほかの行のjointConditionも変更する
        setFilterRows((oldState) => {
          const newState = [...oldState];
          newState.map((row) => {
            row.currentState.jointCondition = currentFilter.jointCondition;
            return row;
          });
          return newState;
        });
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
    convertQueryFilter, // For testing purpose
    convertQueryToFilterRows, // For testing purpose
    generateGraphQLQueryFilter, // For testing purpose
    initialFilterRows, // For testing purpose
    setPrevFilter, // For testing purpose
  };
};

const isEmpty = (obj: object | undefined): boolean => {
  if (obj === undefined) return true;
  return Object.keys(obj).length === 0;
};
