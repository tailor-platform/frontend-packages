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

export type DataGridWithFilterStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridWithFilterStory = ({
  enableColumnFilters = false,
}: DataGridWithFilterStoryProps) => {
  const [currentFilter, setCurrentFilter] = useState({});
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data: data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      const isSameFilter =
        JSON.stringify(filter) === JSON.stringify(currentFilter);
      if (!isSameFilter) {
        setCurrentFilter(filter);
        if(filter?.status?.eq){
          setData(originData.filter((row) => row.status === filter.status.eq));
        } else if(filter?.status?.neq){
          setData(originData.filter((row) => row.status !== filter.status.neq));
        }
      }
    },
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridWithFilterStory.displayName = "DataGridWithFilter";
