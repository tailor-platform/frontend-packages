import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  CSSProperties,
} from "react";
import type { GraphQLQueryFilter, Localization } from "..";
import type { Column } from "../types";
import { jointConditions } from "./filter";
import { FilterRowState, JointCondition, QueryRow } from "./types";
import { generateGraphQLFilter } from "./graphQLQuery";

export type FilterRowData = {
  index: number; //Row number
  currentState: FilterRowState;
};

type UseCustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter | undefined) => void;
  localization: Localization;
  systemFilter?: QueryRow;
  defaultFilter?: QueryRow;
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
    (
      filter: QueryRow,
      filterRowIndex: number,
      jointCondition?: string,
    ): FilterRowData[] => {
      return Object.keys(filter).flatMap((key) => {
        const filterValue = filter[key];
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

  const [prevFilter, setPrevFilter] = useState<GraphQLQueryFilter | undefined>(
    {},
  );

  /**
   * This will bubble up the GraphQLQueryFilter to the parent component.
   */
  useEffect(() => {
    const filter = generateGraphQLFilter({
      currentFilterRows: filterRows,
      columns,
      systemFilter,
      localization,
    });

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
    setPrevFilter, // For testing purpose
  };
};
