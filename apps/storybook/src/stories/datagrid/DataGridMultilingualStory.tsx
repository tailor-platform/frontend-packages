"use client";

import {
  Box,
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems";

import { LOCALIZATION_JA } from "@tailor-platform/design-systems/locales/ja";
import { LOCALIZATION_EN } from "@tailor-platform/design-systems/locales/en";

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
    localization: localization === "JA" ? LOCALIZATION_JA : LOCALIZATION_EN,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridMultilingualStory.displayName = "DataGridMultilingual";
