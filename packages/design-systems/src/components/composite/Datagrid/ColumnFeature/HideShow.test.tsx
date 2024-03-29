import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { useDataGrid } from "../useDataGrid";
import { LOCALIZATION_EN } from "../../../../locales/en";
import { DataGrid } from "../Datagrid";
import { HideShow } from "./HideShow";

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
      //accessorKey is not provided at compile time inside ColumnDef https://github.com/TanStack/table/issues/4423
      accessorKey: "status",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      type: "string",
      accessorKey: "email",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      type: "number",
      accessorKey: "amount",
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

const HideShowTest = () => {
  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useDataGrid({
    data,
    columns,
    enableHiding: true,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });
  return (
    <HideShow
      allColumnsHandler={table.getToggleAllColumnsVisibilityHandler}
      columns={table.getAllLeafColumns()}
      localization={LOCALIZATION_EN}
    />
  );
};

const DataGridWithHideShow = () => {
  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useDataGrid({
    data,
    columns,
    enableHiding: true,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });
  return <DataGrid table={table} />;
};

describe("<HideShow />", () => {
  it("renders correctly", () => {
    render(<HideShowTest />);

    expect(screen.getAllByText("Status")[0]).toBeVisible();
    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.getByText("Amount")).toBeVisible();
  });

  it("hides the 'Status' column", async () => {
    render(<DataGridWithHideShow />);
    expect(screen.getAllByText("Status")[1]).toBeVisible();
    const user = userEvent.setup();
    await user.click(screen.getAllByText("Column")[0]);
    // Because we need to click "Status" in "HideShow" instead of "Status" in the header.
    await user.click(screen.getAllByText("Status")[1]);
    await user.click(screen.getAllByText("Column")[0]);
    await vi.waitFor(() => {
      expect(screen.queryAllByText("Status")[1]).not.toBeInTheDocument();
    });
  });
});
