"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { type DataGridInstance, type useDataGridProps } from "@/types";
import { Checkbox } from "@tailor-platform/design-systems";

export const useDataGrid = <TData extends Record<string, unknown>>({
  data,
  columns,
  enablePagination = false,
  pagination,
  totalCount = 0,
  onPageChange,
  enableColumnFilters = false,
  enableHiding = false,
  onFilterChange,
  localization,
  columnVisibility,
  onColumnVisibilityChange,
  enableRowSelection = false,
  onRowSelectionChange,
  rowSelection,
  enablePinning = true,
  keepPinnedRows = false,
  columnPinning,
  setColumnPinning,
}: useDataGridProps<TData>): DataGridInstance<TData> => {
  const { pageIndex = 0, pageSize = 10 } = pagination || {};

  const initialState: Record<string, unknown> = {
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
      });
  }
  const reactTableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState,
    enableRowSelection,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    state: {
      columnVisibility,
      rowSelection: enableRowSelection ? rowSelection : {},
    },
    onColumnVisibilityChange,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enablePinning,
    keepPinnedRows
  });

  return {
    ...reactTableInstance,
    handlePageChange: onPageChange,
    totalCount,
    enablePagination,
    enableColumnFilters,
    enableHiding,
    onFilterChange,
    localization,
  };
};
