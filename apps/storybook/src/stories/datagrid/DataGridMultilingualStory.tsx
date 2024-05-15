"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  GraphQLQueryFilter,
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
  const [columnVisibility, setColumnVisibility] = useState({ status: false });
  const defaultQuery: GraphQLQueryFilter = {
    amount: { gt: 200 },
  };
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    enablePagination: true,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    totalCount: data.length,
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
    enableHiding: true,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    enableDensity: true,
    exportOptions: { enableCsvExport: true },
    localization: localization === "JA" ? LOCALIZATION_JA : LOCALIZATION_EN,
    defaultFilter: defaultQuery,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridMultilingualStory.displayName = "DataGridMultilingual";
