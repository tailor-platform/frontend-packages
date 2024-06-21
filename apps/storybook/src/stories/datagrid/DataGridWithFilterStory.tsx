"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
  QueryFilter,
} from "@tailor-platform/design-systems/client";
import { useState } from "react";
import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { Payment } from "../../types/datagrid.ts";
import { setFilterChange } from "./utils.ts";

export type DataGridWithFilterStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridWithFilterStory = ({
  enableColumnFilters = false,
}: DataGridWithFilterStoryProps) => {
  const [data, setData] = useState<Payment[]>(originData);
  const query: QueryFilter = {
    status: { eq: "pending" },
  };
  const defaultQuery: QueryFilter = {
    amount: { gt: 200 },
  };
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    systemFilter: query,
    defaultFilter: defaultQuery,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridWithFilterStory.displayName = "DataGridWithFilter";
