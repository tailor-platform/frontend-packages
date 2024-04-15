"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridDensityStoryProps = {
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridDensityStory = ({}: DataGridDensityStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enableDensity: true,
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} />
    </Box>
  );
};

DataGridDensityStory.displayName = "DataGridDensity";
