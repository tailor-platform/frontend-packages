"use client";

import { useState } from "react";
import {
  ColumnPinningState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "../../Checkbox";
import { type DataGridInstance, type UseDataGridProps } from "./types";

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
}: UseDataGridProps<TData>): DataGridInstance<TData> => {
  const { pageIndex = 0, pageSize = 10 } = pagination || {};
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select"],
    right: [],
  });

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
      columnPinning,
      rowSelection: enableRowSelection ? rowSelection : {},
    },
    onColumnVisibilityChange,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnPinningChange: setColumnPinning,
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
