"use client";

import { useState } from "react";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/datagrid";
import { Box } from "@tailor-platform/styled-system/jsx";
import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridPinedColumnStoryProps = {
  enableColumnFilters?: boolean;
  enableRowSelection?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridPinedColumnStory = ({
  enableColumnFilters = false,
  enableRowSelection = true,
}: DataGridPinedColumnStoryProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    enableRowSelection,
    rowSelection,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} />
    </Box>
  );
};

DataGridPinedColumnStory.displayName = "DataGridPinedColumnStory";
