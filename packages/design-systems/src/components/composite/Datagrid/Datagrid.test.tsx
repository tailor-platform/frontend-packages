import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest"; //For userEvent used for clicks etc. DONT use fireEvent for clicks etc. as it might not work properly with select elements
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useDataGrid } from "./useDataGrid";
import { DataGrid } from "./Datagrid";

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
window.HTMLElement.prototype.scrollTo = function () {}; //(https://github.com/jsdom/jsdom/issues/1695)

enum PaymentStatus {
  pending = "pending",
  processing = "processing",
  success = "success",
  failed = "failed",
}

type Payment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      type: "string",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      type: "number",
    },
  },
];

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: PaymentStatus.pending,
    email: "m@example.com",
  },
  {
    id: "a6b2c3d4",
    amount: 200,
    status: PaymentStatus.processing,
    email: "john@example.com",
  },
  {
    id: "f8e7d6c5",
    amount: 150,
    status: PaymentStatus.success,
    email: "sara@example.com",
  },
  {
    id: "b5c4d3e2",
    amount: 50,
    status: PaymentStatus.failed,
    email: "fail@example.com",
  },
  {
    id: "12345678",
    amount: 300,
    status: PaymentStatus.pending,
    email: "example1@example.com",
  },
  {
    id: "23456789",
    amount: 400,
    status: PaymentStatus.processing,
    email: "example2@example.com",
  },
  {
    id: "34567890",
    amount: 500,
    status: PaymentStatus.success,
    email: "example3@example.com",
  },
];

const DataGridWithSelectableRows = () => {
  const [rowSelection, setRowSelection] = useState({});
  const table = useDataGrid({
    data,
    columns,
    enableRowSelection: true,
    rowSelection,
    onRowSelectionChange: (newSelection) => setRowSelection(newSelection),
  });
  return <DataGrid table={table} />;
};

describe("<Datagrid />", () => {
  it("Renders the Datagrid component correctly", async () => {
    render(<DataGridWithSelectableRows />);
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(data.length + 1); // +1 for the header checkbox
  });

  it("Select/Deselect logic works as expected", async () => {
    render(<DataGridWithSelectableRows />);

    let checkboxes = await screen.findAllByRole("checkbox");
    const headerCheckbox = checkboxes[0];

    // Select all checkboxes
    await act(async () => {
      fireEvent.click(headerCheckbox);
    });
    await act(async () => {
      checkboxes = await screen.findAllByRole("checkbox");
      checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
    });

    // Deselect all checkboxes
    await act(async () => {
      fireEvent.click(headerCheckbox);
    });
    await act(async () => {
      checkboxes = await screen.findAllByRole("checkbox");
      checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    });

    // Test selecting an individual row
    await act(async () => {
      fireEvent.click(checkboxes[1]);
    });
    await act(async () => {
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[0]).not.toBeChecked(); // Header checkbox should be in indeterminate state
    });

    // Test deselecting the same row
    await act(async () => {
      fireEvent.click(checkboxes[1]);
    });
    await act(async () => {
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[0]).not.toBeChecked(); // Header checkbox should be in unchecked state
    });

    // Test selecting all rows individually
    await act(async () => {
      for (let i = 1; i < checkboxes.length; i++) {
        fireEvent.click(checkboxes[i]);
      }
    });
    await act(async () => {
      expect(checkboxes[0]).toBeChecked(); // Header checkbox should be in all selected state
    });
  });
});
