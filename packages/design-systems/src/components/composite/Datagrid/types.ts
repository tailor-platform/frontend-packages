import type {
  ColumnDef,
  ColumnMeta,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { Table } from "@tanstack/table-core/build/lib/types";

interface PageChangeDetails {
  page: number;
  pageSize: number;
}
export interface DataGridInstance<
  TData extends Record<string, unknown> = Record<string, unknown>,
> extends Table<TData> {
  // eslint-disable-next-line no-unused-vars
  handlePageChange?: (details: PageChangeDetails) => void;
  totalCount?: number;
  pageSize?: number;
  enablePagination?: boolean;
  enableColumnFilters?: boolean;
  enableHiding?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter) => void;
  localization?: Localization;
}
export type UseDataGridProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  enablePagination?: boolean;
  enableColumnFilters?: boolean;
  enableHiding?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter) => void;
  pagination?: PaginationState;
  totalCount?: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange?: (details: PageChangeDetails) => void;
  localization?: Localization;
  columnVisibility?: { [key: string]: boolean };
  onColumnVisibilityChange?: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
};
export type ColumnMetaWithTypeInfo<TData> = ColumnMeta<TData, unknown> & {
  type: string;
  enumType?: Record<string, unknown>;
  //https://github.com/TanStack/table/issues/4423
  accessorKey: string;
};
export type Column<TData> = {
  label: string;
  value: string;
  disabled?: boolean;
  meta?: ColumnMetaWithTypeInfo<TData>;
};
export type CustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter) => void;
  localization: Localization;
};
export type FilterRowState = {
  column: string;
  value: string;
  condition: string;
  jointCondition?: string;
};
export type FilterRowProps<TData> = {
  columns: Array<Column<TData>>;
  onDelete: () => void;
  meta?: ColumnMetaWithTypeInfo<TData>;
  onChange: (currentState: FilterRowState) => void;
  localization: Localization;
  isFirstRow: boolean;
  jointConditions: JointCondition[];
  currentFilter: FilterRowState;
};
export type FilterRowData<TData> = {
  columns: Array<Column<TData>>;
  index: number; //Row number
  localization: Localization;
  isFirstRow: boolean;
  jointConditions: JointCondition[];
  currentState: FilterRowState;
};
export type JointCondition = {
  label: string;
  value: string;
  disabled: boolean;
};
export type GraphQLQueryFilter =
  | {
      [fieldName: string]: { [operator: string]: string };
    }
  | {
      [jointCondition: string]: {
        [fieldName: string]: { [operator: string]: string };
      };
    }
  | {
      [jointCondition: string]: GraphQLQueryFilter;
    };

export const GraphQLFilterOperator = {
  EQUAL: "eq",
  LESS_THAN: "lt",
  GREATER_THAN: "gt",
  LESS_THAN_OR_EQUAL: "lte",
  GREATER_THAN_OR_EQUAL: "gte",
  NOT_EQUAL: "neq",
  LIKE: "like",
  NOT_LIKE: "nlike",
} as const;
export type FilterCondition = {
  label: string;
  value: (typeof GraphQLFilterOperator)[keyof typeof GraphQLFilterOperator];
  applicableTypeTypes: ApplicableType[];
  disabled: boolean;
};
export type ApplicableType =
  | "string"
  | "enum"
  | "time"
  | "dateTime"
  | "date"
  | "number"
  | "boolean";
export interface Localization {
  filter: {
    filterLabel: string;
    filterResetLabel: string;
    addNewFilterLabel: string;
    jointConditionLabel: string;
    jointConditionPlaceholder: string;
    columnLabel: string;
    columnPlaceholder: string;
    condition: {
      conditionLabel: string;
      conditionPlaceholder: string;
      operatorLabel: {
        equal: string;
        notEqual: string;
        include: string;
        notInclude: string;
        greaterThan: string;
        lessThan: string;
        greaterThanOrEqual: string;
        lessThanOrEqual: string;
      };
    };
    valueLabel: string;
    valuePlaceholder: string;
    valuePlaceholderEnum: string;
    validationErrorDate: string;
  };
  columnFeatures: {
    hideShow: {
      showAll: string;
    };
  };
}
