"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridPaginationStoryProps = {
  pageSize?: number;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridPaginationStory = ({
  pageSize = 5,
}: DataGridPaginationStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enablePagination: true,
    totalCount: 14,
    pagination: {
      pageIndex: 0,
      pageSize: pageSize,
    },
    pageSizeOptions: [5, 10, 15, 20],
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} size="2xl" />
    </Box>
  );
};

DataGridPaginationStory.displayName = "PaginationDataGrid";
