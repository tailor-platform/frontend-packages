import type {
  ColumnDef,
  ColumnMeta,
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { Updater } from "@tanstack/table-core/build/lib/types";
import type { Localization } from "../../../locales/types";
import type { ExportState } from "./Export/types";
import type { GraphQLQueryFilter, QueryRow } from "./SearchFilter/types";
import type { PageChangeDetails } from "./Pagination/ManualPagination";
import { RowLike, useDataGrid } from "./useDataGrid";

type C<TData extends Record<string, unknown>> = {
  totalCount?: number;
  enablePagination?: boolean;
  manualPagination?: boolean;
  enableColumnFilters?: boolean;
  enableHiding?: boolean;
  systemFilter?: QueryRow;
  defaultFilter?: QueryRow;
  localization?: Localization;
  columns: ColumnDef<TData>[];
  enableDensity?: boolean;
  enableSorting?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter | undefined) => void;
  onSortChange?: (sorting: Order<TData> | undefined) => void;
  pageSizeOptions?: number[];
};

export type DataGridInstance<TData extends RowLike> = ReturnType<
  typeof useDataGrid<TData>
>;

export type UseDataGridProps<TData extends Record<string, unknown>> =
  C<TData> & {
    data: TData[];
    pagination?: PaginationState;
    onPageChange?: (details: PageChangeDetails) => void;
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
    exportOptions?: ExportState<TData>;
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
