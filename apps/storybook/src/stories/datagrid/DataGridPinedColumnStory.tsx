"use client";

import { useState } from "react";
import {
  DataGrid,
  DataGridInstance,
  newColumnBuilder,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { Button } from "@tailor-platform/design-systems";
import { Box } from "@tailor-platform/styled-system/jsx";
import { COLUMNS as columns, DATA as data } from "../../data/datagrid";
import { Payment } from "../../types/datagrid";

export type DataGridPinedColumnStoryProps = {
  enableColumnFilters?: boolean;
  enableRowSelection?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridPinedColumnStory = ({
  enableColumnFilters = false,
  enableRowSelection = true,
}: DataGridPinedColumnStoryProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const columnBuilder = newColumnBuilder<Payment>();
  const table = useDataGrid({
    data,
    columns: [
      ...columns,
      columnBuilder.custom("operation", "Ops", {
        size: 100,
        render: () => <Button>Show</Button>,
      }),
    ],
    enableColumnFilters,
    enableRowSelection,
    rowSelection,
    columnPinning: {
      right: ["operation"],
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <Box w="full" style={{ marginTop: "50px" }}>
      <DataGrid table={table} />
    </Box>
  );
};

DataGridPinedColumnStory.displayName = "DataGridPinedColumnStory";
