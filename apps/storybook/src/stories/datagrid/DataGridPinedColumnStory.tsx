"use client";

import { useState } from "react";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { Button } from "@tailor-platform/design-systems";
import { Box } from "@tailor-platform/styled-system/jsx";
import { COLUMNS as columns, DATA as data } from "../../data/datagrid";

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
  const table = useDataGrid({
    data,
    columns: [
      ...columns,
      {
        id: "operation",
        header: "Ops",
        cell: () => {
          return <Button>Show</Button>;
        },
        size: 100,
      },
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
