"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { Payment } from "../../types/datagrid.ts";
import { useState } from "react";

export type DataGridManualPaginationStoryProps = {
  pageSize: number;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridManualPaginationStory = ({
  pageSize = 8,
}: DataGridManualPaginationStoryProps) => {
  const [data, setData] = useState<Payment[]>(originData.slice(0, pageSize));

  const table = useDataGrid({
    data,
    columns,
    enablePagination: true,
    manualPagination: true,
    totalCount: originData.length,
    pagination: {
      pageIndex: 0,
      pageSize,
    },
    onPageChange: ({ page, pageSize }) => {
      const fetchedData = originData.slice(
        page * pageSize,
        pageSize * (page + 1),
      );
      setData(fetchedData);
    },
  });
  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} />
    </Box>
  );
};

DataGridManualPaginationStory.displayName = "ManualPaginationDataGrid";
