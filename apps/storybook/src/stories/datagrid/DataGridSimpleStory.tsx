"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridSimpleStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridSimpleStory = ({
  enableColumnFilters = false,
}: DataGridSimpleStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} />
    </Box>
  );
};

DataGridSimpleStory.displayName = "SimpleDataGrid";
