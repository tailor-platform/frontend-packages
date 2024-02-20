"use client";

import { useState } from "react";

import {
  Box,
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems";

import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridWithSelectableRowsStoryProps = {
  enableColumnFilters?: boolean;
  enableRowSelection?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridWithSelectableRowsStory = ({
  enableColumnFilters = false,
  enableRowSelection = true,
}: DataGridWithSelectableRowsStoryProps) => {
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

DataGridWithSelectableRowsStory.displayName = "DataGridWithSelectableRowsStory";
