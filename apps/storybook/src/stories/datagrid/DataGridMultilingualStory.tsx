"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { LOCALIZATION_JA } from "@tailor-platform/design-systems/locales/ja";
import { LOCALIZATION_EN } from "@tailor-platform/design-systems/locales/en";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { setFilterChange } from "./utils.ts";
import { Payment } from "../../types/datagrid.ts";
import { useState } from "react";

export type DataGridMultilingualStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
  localization?: "EN" | "JA";
};

export const DataGridMultilingualStory = ({
  enableColumnFilters = false,
  localization = "EN",
}: DataGridMultilingualStoryProps) => {
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    enablePagination: true,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    totalCount: 14,
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
    localization: localization === "JA" ? LOCALIZATION_JA : LOCALIZATION_EN,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridMultilingualStory.displayName = "DataGridMultilingual";
