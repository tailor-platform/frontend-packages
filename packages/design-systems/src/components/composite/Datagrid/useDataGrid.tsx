import { useState } from "react";
import {
  ColumnPinningState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type UseDataGridProps } from "./types";
import { DensityFeature } from "./Density/Density";
import { ExportFeature, defaultExportOptions } from "./Export/Export";
import { HideShowFeature } from "./ColumnFeature/HideShow";
import { CustomFilterFeature } from "./SearchFilter/CustomFilter";
import { buildColumns } from "./column";

export type RowLike = { id: string };
export const useDataGrid = <TData extends RowLike>({
  data,
  columns,
  enablePagination = false,
  manualPagination = false,
  pagination,
  totalCount = 0,
  onPageChange,
  enableColumnFilters = false,
  enableHiding = false,
  onFilterChange,
  systemFilter,
  defaultFilter,
  localization,
  columnVisibility,
  columnPinning,
  onColumnVisibilityChange,
  enableRowSelection = false,
  onRowSelectionChange,
  rowSelection,
  pageSizeOptions = [],
  enableDensity = false,
  exportOptions = defaultExportOptions,
  enableSorting = false,
  onSortChange,
}: UseDataGridProps<TData>) => {
  const { pageIndex = 0, pageSize = 50 } = pagination || {};
  const [columnPinningState, setColumnPinningState] =
    useState<ColumnPinningState>({
      left: ["select", ...(columnPinning?.left || [])],
      right: [...(columnPinning?.right || [])],
    });
  const [sorting, setSorting] = useState<SortingState>([]);

  const initialState = {
    pagination: {
      pageIndex,
      pageSize,
    },
  };

  const reactTableColumns = buildColumns(columns, enableRowSelection);
  const { state, sortingConfigs } = manualPagination
    ? {
        state: {
          columnVisibility,
          columnPinning: columnPinningState,
          rowSelection: enableRowSelection ? rowSelection : {},
          exportOptions,
          sorting: sorting,
        },
        sortingConfigs: {
          manualSorting: manualPagination,
          onSortingChange: setSorting,
        },
      }
    : {
        state: {
          columnVisibility,
          columnPinning: columnPinningState,
          rowSelection: enableRowSelection ? rowSelection : {},
          exportOptions,
        },
        sortingConfigs: {},
      };

  const reactTableInstance = useReactTable({
    _features: [
      CustomFilterFeature,
      HideShowFeature,
      DensityFeature,
      ExportFeature,
    ],
    data,
    columns: reactTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    manualPagination,
    autoResetPageIndex: true,
    rowCount: totalCount,
    initialState,
    enableRowSelection,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    state,
    onColumnVisibilityChange,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnPinningChange: setColumnPinningState,
    getRowId: (row) => row.id,
    enableDensity,
    enableSorting,
    getSortedRowModel:
      enableSorting && !manualPagination ? getSortedRowModel() : undefined,
    sortDescFirst: true,
    exportOptions,
    ...sortingConfigs,
  });

  return {
    ...reactTableInstance,
    handlePageChange: onPageChange,
    totalCount,
    enablePagination,
    manualPagination,
    enableColumnFilters,
    enableHiding,
    onFilterChange,
    systemFilter,
    defaultFilter,
    localization,
    columns,
    pageSizeOptions,
    enableDensity,
    enableSorting,
    onSortChange,
  };
};
