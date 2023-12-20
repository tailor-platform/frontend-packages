"use client";

import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/datagrid";
import { Localization_JA } from "@tailor-platform/datagrid/locales/ja";
import { Localization_EN } from "@tailor-platform/datagrid/locales/en";
import { Box } from "@tailor-platform/styled-system/jsx";

import { COLUMNS as columns, DATA as data } from "../../data/datagrid.ts";

export type DataGridMultilingualStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
  localization?: "EN" | "JA";
};

export const DataGridMultilingualStory = ({
  enableColumnFilters = false,
  localization = "EN",
}: DataGridMultilingualStoryProps) => {
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    localization: localization === "JA" ? Localization_JA : Localization_EN,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridMultilingualStory.displayName = "DataGridMultilingual";
