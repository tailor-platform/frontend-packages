"use client";

import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/datagrid";
import { Box } from "@tailor-platform/styled-system/jsx";

import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridWithFilterStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridWithFilterStory = ({
  enableColumnFilters = false,
}: DataGridWithFilterStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridWithFilterStory.displayName = "DataGridWithFilter";
