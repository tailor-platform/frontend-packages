import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { Column, MetaType } from "../types";
import { Localization } from "..";
import { FilterRowState, QueryRow, QueryRowValue } from "./types";
import { FilterRowData } from "./useCustomFilter";

type UseGraphQLQueryProps<TData> = {
  localization: Localization;
  systemFilter?: QueryRow;
  columns: Array<Column<TData>>;
};

export const useGraphQLQuery = <TData>(props: UseGraphQLQueryProps<TData>) => {
  const { localization, systemFilter, columns } = props;

  const valueConverter = useCallback(
    (
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
          return value.toLowerCase() === localization.filter.columnBoolean.true;
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
    },
    [localization.filter.columnBoolean.true],
  );

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
      graphQLQueryObject: QueryRow,
      metaType: MetaType | undefined,
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

      if (jointCondition) {
        const filterRow = graphQLQueryObject[jointCondition];

        if (filterRow && Array.isArray(filterRow)) {
          filterRow.push(
            generateGraphQLQueryObject(valueConverter(metaType, value)),
          );
        } else {
          graphQLQueryObject[jointCondition] = [
            generateGraphQLQueryObject(valueConverter(metaType, value)),
          ];
        }
      } else {
        graphQLQueryObject[column] = {
          [condition]: valueConverter(metaType, value),
        };
      }
    },
    [valueConverter],
  );

  const convertedSystemFilter = useMemo(() => {
    const convertedSystemFilter: QueryRow = {};
    if (systemFilter) {
      Object.keys(systemFilter).flatMap((key) => {
        const filterValue = systemFilter[key];
        const keys = Object.keys(filterValue);
        const values = Object.values(filterValue);
        if (keys.length > 0 && values.length > 0) {
          const condition = keys[0];
          const value = values[0] as QueryRowValue;
          const metaType = columns.find((c) => c.accessorKey === key)?.meta
            ?.type;
          convertedSystemFilter[key] = {
            [condition]: valueConverter(metaType, value),
          };
        } else {
          return undefined;
        }
      });
    } else {
      return undefined;
    }

    return convertedSystemFilter;
  }, [columns, systemFilter, valueConverter]);
  /**
   * This will convert the FilterRowState object from the UI to GraphQLQueryFilter and add it to the GraphQLQueryFilter.
   */
  const generateFilter = useCallback(
    (currentFilterRows: FilterRowData[]) => {
      const newGraphQLQueryFilter: QueryRow = {};
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
            );
          }
        }
      });

      if (isEmpty(systemFilter) && isEmpty(newGraphQLQueryFilter)) {
        return undefined;
      }
      return {
        and: {
          ...convertedSystemFilter,
          ...newGraphQLQueryFilter,
        },
      };
    },
    [systemFilter, columns, convertQueryFilter, convertedSystemFilter],
  );

  return {
    generateFilter,
    convertQueryFilter, // For testing purpose
    convertedSystemFilter, // For testing purpose
  };
};

const isEmpty = (obj: object | undefined): boolean => {
  if (obj === undefined) return true;
  return Object.keys(obj).length === 0;
};
