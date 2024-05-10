import { useState } from "react";
import {
  ColumnPinningState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "../../Checkbox";
import { type DataGridInstance, type UseDataGridProps } from "./types";
import { DensityFeature } from "./Density/Density";
import { ExportFeature } from "./Export/Export";
import { HideShowFeature } from "./ColumnFeature/HideShow";
import { CustomFilterFeature } from "./SearchFilter/CustomFilter";

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
  exportOptions = { enableCsvExport: false },
  enableSorting = false,
  onSortChange,
}: UseDataGridProps<TData>): DataGridInstance<TData> => {
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
