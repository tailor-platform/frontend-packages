"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
  QueryLow,
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
  const query: QueryLow = {
    status: { eq: "pending" },
  };
  const defaultQuery: QueryLow = {
    amount: { gt: 200 },
  };
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    systemFilter: query,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    defaultFilter: defaultQuery,
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridWithFilterStory.displayName = "DataGridWithFilter";
