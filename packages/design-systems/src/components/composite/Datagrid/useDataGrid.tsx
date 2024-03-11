import { useState } from "react";
import {
  ColumnPinningState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "../../Checkbox";
import { type DataGridInstance, type UseDataGridProps } from "./types";

type RowLike = { id: string };

export const useDataGrid = <TData extends RowLike>({
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
  columnPinning,
  onColumnVisibilityChange,
  enableRowSelection = false,
  onRowSelectionChange,
  rowSelection,
}: UseDataGridProps<TData>): DataGridInstance<TData> => {
  const { pageIndex = 0, pageSize = 10 } = pagination || {};
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
