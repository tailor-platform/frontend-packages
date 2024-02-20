"use client";

import {
  Box,
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems";
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
