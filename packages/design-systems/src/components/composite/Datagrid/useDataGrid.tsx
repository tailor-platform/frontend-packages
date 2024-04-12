import { useState } from "react";
import {
  ColumnPinningState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "../../Checkbox";
import { type DataGridInstance, type UseDataGridProps } from "./types";
import { DensityFeature } from "./Density/Density";

type RowLike = { id: string };

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
}: UseDataGridProps<TData>): DataGridInstance<TData> => {
  const { pageIndex = 0, pageSize = 50 } = pagination || {};
  const [columnPinningState, setColumnPinningState] =
    useState<ColumnPinningState>({
      left: ["select", ...(columnPinning?.left || [])],
      right: [...(columnPinning?.right || [])],
    });

  const initialState = {
    pagination: {
      pageIndex,
      pageSize,
    },
  };
  if (enableRowSelection) {
    const selectableHeaderAlreadyExists =
      columns.findIndex((column) => column.id === "select") !== -1;
    !selectableHeaderAlreadyExists &&
      columns.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsSomeRowsSelected()
                ? "indeterminate"
                : table.getIsAllRowsSelected()
            }
            onCheckedChange={(e: { checked: boolean }) =>
              table.getToggleAllRowsSelectedHandler()({
                target: { checked: e.checked },
              })
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(e: { checked: boolean }) =>
              row.getToggleSelectedHandler()(e.checked)
            }
          />
        ),
        size: 54,
      });
  }
  const reactTableInstance = useReactTable({
    _features: [DensityFeature],
    data,
    columns,
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
    state: {
      columnVisibility,
      columnPinning: columnPinningState,
      rowSelection: enableRowSelection ? rowSelection : {},
    },
    onColumnVisibilityChange,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnPinningChange: setColumnPinningState,
    getRowId: (row) => row.id,
    enableDensity,
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
    defaultFilter,
    localization,
    columns,
    pageSizeOptions,
    enableDensity,
  };
};
