import type {
  ColumnDef,
  ColumnMeta,
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { Table, Updater } from "@tanstack/table-core/build/lib/types";
import type { Localization } from "../../../locales/types";
import type { ExportState } from "./Export/types";
import type { GraphQLQueryFilter } from "./SearchFilter/types";
import type { PageChangeDetails } from "./Pagination/ManualPagination";

export interface DataGridInstance<
  TData extends Record<string, unknown> = Record<string, unknown>,
> extends Table<TData> {
  handlePageChange?: (details: PageChangeDetails) => void;
  totalCount?: number;
  pageSize?: number;
  enablePagination?: boolean;
  manualPagination?: boolean;
  enableColumnFilters?: boolean;
  enableHiding?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter | undefined) => void;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
  localization?: Localization;
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  enableDensity?: boolean;
  enableSorting?: boolean;
  onSortChange?: (sorting: Order<TData> | undefined) => void;
}

export type UseDataGridProps<TData extends Record<string, unknown>> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  enablePagination?: boolean;
  manualPagination?: boolean;
  enableColumnFilters?: boolean;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
  enableHiding?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter | undefined) => void;
  pagination?: PaginationState;
  totalCount?: number;
  onPageChange?: (details: PageChangeDetails) => void;
  localization?: Localization;
  columnVisibility?: { [key: string]: boolean };
  onColumnVisibilityChange?: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enablePinning?: boolean;
  columnPinning?: ColumnPinningState;
  setColumnPinning?: (updater: Updater<ColumnPinningState>) => void;
  pageSizeOptions?: number[];
  enableDensity?: boolean;
  exportOptions?: ExportState<TData>;
  enableSorting?: boolean;
  onSortChange?: (sorting: Order<TData> | undefined) => void;
};

export type MetaType =
  | "enum"
  | "date"
  | "number"
  | "string"
  | "boolean"
  | "dateTime";

export type Column<TData> = {
  label: string;
  value: string;
  accessorKey: string;
  disabled?: boolean;
  meta?: ColumnMeta<TData, unknown>;
};

export type Order<TData> = {
  field: keyof TData;
  direction: "Asc" | "Desc";
};
