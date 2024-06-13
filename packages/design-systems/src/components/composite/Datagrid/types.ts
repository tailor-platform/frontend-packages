import type {
  ColumnDef,
  ColumnMeta,
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  Table,
} from "@tanstack/react-table";
import type { Updater } from "@tanstack/table-core/build/lib/types";
import type { Localization } from "../../../locales/types";
import type { ExportState } from "./Export/types";
import type { GraphQLQueryFilter, QueryRow } from "./SearchFilter/types";
import type { PageChangeDetails } from "./Pagination/ManualPagination";

type CommonDatagridProps<TData extends Record<string, unknown>> = {
  localization?: Localization;
  columns: ColumnDef<TData>[];

  // Filter
  enableColumnFilters?: boolean;
  systemFilter?: QueryRow;
  defaultFilter?: QueryRow;
  onFilterChange?: (filters: GraphQLQueryFilter | undefined) => void;

  // Column hiding
  enableHiding?: boolean;

  // Denstiy
  enableDensity?: boolean;

  // Sorting
  enableSorting?: boolean;
  onSortChange?: (sorting: Order<TData> | undefined) => void;

  // Pagination
  totalCount?: number;
  enablePagination?: boolean;
  manualPagination?: boolean;
  pageSizeOptions?: number[];
};

export type DataGridInstance<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = Table<TData> &
  CommonDatagridProps<TData> & {
    handlePageChange?: (details: PageChangeDetails) => void;
  };

export type UseDataGridProps<TData extends Record<string, unknown>> =
  CommonDatagridProps<TData> & {
    data: TData[];

    // Column visibility
    columnVisibility?: { [key: string]: boolean };
    onColumnVisibilityChange?: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >;

    // Row selection
    enableRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;

    // Column pinning
    enablePinning?: boolean;
    columnPinning?: ColumnPinningState;
    setColumnPinning?: (updater: Updater<ColumnPinningState>) => void;

    // Pagination
    pagination?: PaginationState;
    onPageChange?: (details: PageChangeDetails) => void;

    // Export
    exportOptions?: ExportState<TData>;
  };

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
