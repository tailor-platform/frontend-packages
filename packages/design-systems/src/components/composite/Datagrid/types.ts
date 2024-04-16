import type {
  Column as ColumnTanstak,
  ColumnDef,
  ColumnMeta,
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { Table, Updater } from "@tanstack/table-core/build/lib/types";
import { CollectionItem } from "@ark-ui/react/select";
import type { Localization } from "../../../locales/types";

export interface PageChangeDetails {
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
  manualPagination?: boolean;
  enableColumnFilters?: boolean;
  enableHiding?: boolean;
  onFilterChange?: (filters: GraphQLQueryFilter) => void;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
  localization?: Localization;
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  enableDensity?: boolean;
}
export type UseDataGridProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  enablePagination?: boolean;
  manualPagination?: boolean;
  enableColumnFilters?: boolean;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
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
  enablePinning?: boolean;
  columnPinning?: ColumnPinningState;
  setColumnPinning?: (updater: Updater<ColumnPinningState>) => void;
  pageSizeOptions?: number[];
  enableDensity?: boolean;
  exportOptions?: ExportState;
};
export type Column<TData> = {
  label: string;
  value: string;
  accessorKey: string;
  disabled?: boolean;
  meta?: ColumnMeta<TData, unknown>;
};

export interface CustomFilterTableState {
  customFilterOpen: boolean;
}

export interface CustomFilterOptions {
  enableCustomFilter?: boolean;
}

export interface CustomFilterInstance {
  setCustomFilterOpen: (updater: Updater<boolean>) => void;
}

export type CustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter) => void;
  localization: Localization;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
  customFilterOpen: boolean;
  setCustomFilterOpen: (updater: Updater<boolean>) => void;
};
export type FilterRowState = {
  column: string;
  value: string;
  condition: string;
  jointCondition?: string;
  isSystem: boolean;
  isChangeable: boolean;
};
export type FilterRowProps<TData> = {
  columns: Array<Column<TData>>;
  onDelete: () => void;
  meta?: ColumnMeta<TData, unknown>;
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
export type GraphQLQueryFilter = {
  [fieldName: string]: { [operator: string]: unknown } | GraphQLQueryFilter;
};

export const GraphQLFilterOperator = {
  EQUAL: "eq",
  LESS_THAN: "lt",
  GREATER_THAN: "gt",
  LESS_THAN_OR_EQUAL: "lte",
  GREATER_THAN_OR_EQUAL: "gte",
  NOT_EQUAL: "neq",
  CONTAINS: "contains",
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

export interface ValueChangeDetails<T extends CollectionItem = CollectionItem> {
  value: string[];
  items: T[];
}

export type Page = {
  index: number;
  type: "page" | "ellipsis";
};

export interface HideShowTableState {
  hideShowOpen: boolean;
}

export interface HideShowOptions {
  enableHideShow?: boolean;
}

export interface HideShowInstance {
  setHideShowOpen: (updater: Updater<boolean>) => void;
}

export type HideShowProps<TData extends Record<string, unknown>> = {
  allColumnsHandler: () => (event: unknown) => void;
  columns: Array<ColumnTanstak<TData>>;
  localization: Localization;
  hideShowOpen: boolean;
  setHideShowOpen: (updater: Updater<boolean>) => void;
};

export type DensityState = "sm" | "md" | "lg";
export interface DensityTableState {
  density: DensityState;
  densityOpen: boolean;
}

export interface DensityOptions {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void;
  setDensityOpen: (updater: Updater<boolean>) => void;
}

export type DensityProps = {
  setDensity: (updater: Updater<DensityState>) => void;
  localization: Localization;
  densityOpen: boolean;
  setDensityOpen: (updater: Updater<boolean>) => void;
};

export type ExportState = {
  enableCsvExport?: boolean;
};

export interface ExportTableState {
  exportOptions: ExportState;
  exportOpen: boolean;
}

export interface ExportOptions {}

export interface ExportInstance {
  setExportOpen: (updater: Updater<boolean>) => void;
  getEnableExport: () => boolean;
  exportCsv: () => void;
}

export type ExportProps = {
  exportOptions?: ExportState;
  localization: Localization;
  exportCsv: () => void;
  exportOpen: boolean;
  setExportOpen: (updater: Updater<boolean>) => void;
};
