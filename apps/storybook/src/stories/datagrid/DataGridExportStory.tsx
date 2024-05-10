"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { useState } from "react";
import { Payment } from "../../types/datagrid.ts";
import { setFilterChange } from "./utils.ts";

export type DataGridExportStoryProps = {
  enableColumnFilters?: boolean;
  enableCsvExport?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridExportStory = ({
  enableColumnFilters = false,
  enableCsvExport = true,
}: DataGridExportStoryProps) => {
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    exportOptions: { enableCsvExport },
    exportRejectColumns: ["updatedAt"],
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridExportStory.displayName = "DataGridExport";
