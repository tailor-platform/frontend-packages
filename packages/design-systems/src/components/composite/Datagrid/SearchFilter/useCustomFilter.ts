import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import type { RootQueryFilter } from "..";
import type { Column } from "../types";
import { jointConditions } from "./filter";
import { FilterRowState, JointCondition, QueryFilter } from "./types";
import { useGraphQLQuery } from "./useGraphQLQuery";

export type FilterRowData = {
  index: number; //Row number
  currentState: FilterRowState;
};

type UseCustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: RootQueryFilter | undefined) => void;
  systemFilter?: QueryFilter;
  defaultFilter?: QueryFilter;
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
  const { generateFilter } = useGraphQLQuery({
    columns,
    systemFilter,
  });

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
    (
      filter: QueryFilter,
      filterRowIndex: number,
      jointCondition?: string,
    ): FilterRowData[] => {
      return Object.keys(filter).flatMap((key) => {
        const filterValue = filter[key];
        if (filterValue === undefined || filterValue === null) {
          return [];
        }

        if (Array.isArray(filterValue)) {
          if (key === "and" || key === "or") {
            return filterValue.flatMap((value, index) => {
              return convertQueryToFilterRows(
                value,
                filterRowIndex + index,
                key,
              );
            });
          } else {
            return [];
          }
        }

        // All the filter should have the exact one pair of condition and value
        // So if there is no or are more than one pair, we will ignore the rest.
        const conditions = Object.keys(filterValue);
        const values = Object.values(filterValue);
        if (conditions.length === 0 || values.length === 0) {
          return [];
        }

        return [
          {
            index: filterRowIndex,
            currentState: {
              column: key,
              condition: conditions[0],
              value: values[0],
              jointCondition,
              isChangeable: true,
            },
          },
        ];
      });
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

  const [prevFilter, setPrevFilter] = useState<RootQueryFilter | undefined>({});

  /**
   * This will bubble up the GraphQLQueryFilter to the parent component.
   */
  useEffect(() => {
    const filter = generateFilter(filterRows);

    if (JSON.stringify(prevFilter) !== JSON.stringify(filter)) {
      onChange(filter);
      setPrevFilter(filter);
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

  const numberOfSearchConditions = useMemo(() => {
    const isCurrentStateValid = (state: FilterRowData) => {
      return (
        state.currentState.column &&
        state.currentState.condition &&
        state.currentState.value
      );
    };
    const count = filterRows.reduce((acc, row, index) => {
      // First row does not have jointCondition
      if (index === 0) {
        if (isCurrentStateValid(row)) {
          return acc + 1;
        }
        return acc;
      }
      if (isCurrentStateValid(row) && row.currentState.jointCondition) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return count;
  }, [filterRows]);

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
    generateGraphQLQueryFilter: generateFilter, // For testing purpose
    setPrevFilter, // For testing purpose
    numberOfSearchConditions,
  };
};
