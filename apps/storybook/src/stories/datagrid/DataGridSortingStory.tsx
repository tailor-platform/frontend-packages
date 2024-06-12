"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridSortingStoryProps = {
  pageSize?: number;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridSortingStory = ({
  pageSize = 5,
}: DataGridSortingStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enableSorting: true,
    totalCount: 14,
    pagination: {
      pageIndex: 0,
      pageSize: pageSize,
    },
    pageSizeOptions: [5, 10, 15, 20],
    enablePagination: true,
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} size="2xl" />
    </Box>
  );
};

DataGridSortingStory.displayName = "SortingDataGrid";
