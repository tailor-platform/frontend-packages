import dayjs from "dayjs";
import { Column, MetaType } from "../types";
import { Localization } from "..";
import { FilterRowState, QueryRow, QueryRowValue } from "./types";
import { FilterRowData } from "./useCustomFilter";

type GenerateFilterProps<TData> = {
  currentFilterRows: FilterRowData[];
  localization: Localization;
  systemFilter?: QueryRow;
  columns: Array<Column<TData>>;
};

/**
 * This will convert the FilterRowState object from the UI to GraphQLQueryFilter and add it to the GraphQLQueryFilter.
 */
export const generateGraphQLFilter = <TData>(
  props: GenerateFilterProps<TData>,
) => {
  const { localization, systemFilter, columns, currentFilterRows } = props;

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
          localization,
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
      ...systemFilter,
      ...newGraphQLQueryFilter,
    },
  };
};

const valueConverter = (
  localization: Localization,
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
};

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
export const convertQueryFilter = (
  localization: Localization,
  filter: FilterRowState,
  graphQLQueryObject: QueryRow,
  metaType: MetaType | undefined,
) => {
  const { column, condition, value, jointCondition } = filter;
  const generateGraphQLQueryObject = (value: QueryRowValue) => {
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
        generateGraphQLQueryObject(
          valueConverter(localization, metaType, value),
        ),
      );
    } else {
      graphQLQueryObject[jointCondition] = [
        generateGraphQLQueryObject(
          valueConverter(localization, metaType, value),
        ),
      ];
    }
  } else {
    graphQLQueryObject[column] = {
      [condition]: valueConverter(localization, metaType, value),
    };
  }
};

const isEmpty = (obj: object | undefined): boolean => {
  if (obj === undefined) return true;
  return Object.keys(obj).length === 0;
};
