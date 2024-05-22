"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  Order,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { Payment } from "../../types/datagrid.ts";
import { useState } from "react";
import { setSortChange } from "./utils.ts";

export type DataGridManualSortingStoryProps = {
  pageSize: number;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridManualSortingStory = ({
  pageSize = 8,
}: DataGridManualSortingStoryProps) => {
  const [data, setData] = useState<Payment[]>(originData.slice(0, pageSize));
  const [sorting, setSorting] = useState<Order<Payment> | undefined>(undefined);
  const [ps, setPs] = useState(pageSize);

  const table = useDataGrid({
    data,
    columns,
    enablePagination: true,
    manualPagination: true,
    totalCount: originData.length,
    pagination: {
      pageIndex: 0,
      pageSize,
    },
    onPageChange: ({ page, pageSize }) => {
      const fetchedData = setSortChange(originData, sorting).slice(
        page * pageSize,
        pageSize * (page + 1),
      );
      setData(fetchedData);
      setPs(pageSize);
    },
    enableSorting: true,
    onSortChange: (sorting) => {
      if (sorting !== undefined) {
        setSorting(sorting);
        setData(setSortChange(originData, sorting).slice(0, ps));
      } else {
        setSorting(undefined);
        setData(originData.slice(0, ps));
      }
    },
  });
  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} size="md" />
    </Box>
  );
};

DataGridManualSortingStory.displayName = "ManualSortingDataGrid";
