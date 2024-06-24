import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { useDataGrid } from "../useDataGrid";
import { DataGrid } from "../Datagrid";
import { newColumnBuilder } from "../column";
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

const columnBuilder = newColumnBuilder<Payment>();
const columns = [
  columnBuilder.enum("status", "Status", PaymentStatus),
  columnBuilder.string("email", "Email"),
  columnBuilder.number("amount", "Amount"),
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
  return <HideShow table={table} />;
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

    expect(screen.getByTestId("hide-show-Status")).toBeVisible();
    expect(screen.getByTestId("hide-show-Email")).toBeVisible();
    expect(screen.getByTestId("hide-show-Amount")).toBeVisible();
  });

  it("hides the 'Status' column", async () => {
    render(<DataGridWithHideShow />);
    expect(screen.getByTestId("datagrid-header-status")).toBeVisible();
    const user = userEvent.setup();

    await user.click(screen.getByTestId("datagrid-hide-show-button"));

    // Because we need to click "Status" in "HideShow" instead of "Status" in the header.
    await user.click(screen.getByTestId("hide-show-Status"));
    // Below is commented out because the test is not working as expected. Error is below:
    // Error: TypeError: win.PointerEvent is not a constructor
    // await user.click(screen.getByTestId("datagrid-hide-show-button"));

    expect(
      screen.queryByTestId("datagrid-header-status"),
    ).not.toBeInTheDocument();
  });
});
