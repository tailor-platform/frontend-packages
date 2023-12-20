"use client";

import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/datagrid";
import { Box } from "@tailor-platform/styled-system/jsx";
import { useState } from "react";
import { DATA as data, COLUMNS as columns } from "../data/datagrid";

export type DataGridColumnHideShowProps = {
  enableHiding?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
  localization?: "EN" | "JA";
};

export const DataGridColumnHideShowStory = ({
  enableHiding = true,
}: DataGridColumnHideShowProps) => {
  const [columnVisibility, setColumnVisibility] = useState({ status: false });
  const table = useDataGrid({
    data,
    columns,
    enableHiding,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridColumnHideShowStory.displayName = "DataGridColumnHideShow";
