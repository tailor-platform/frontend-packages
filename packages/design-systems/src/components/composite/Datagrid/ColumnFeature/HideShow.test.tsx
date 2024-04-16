import { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import { Column, ColumnDef } from "@tanstack/react-table";
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
      columns={
        table.getAllLeafColumns() as unknown as Column<
          Record<string, unknown>,
          unknown
        >[]
      }
      localization={LOCALIZATION_EN}
      isVisible={true}
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

    expect(screen.getByTestId("hide-show-Status")).toBeVisible();
    expect(screen.getByTestId("hide-show-Email")).toBeVisible();
    expect(screen.getByTestId("hide-show-Amount")).toBeVisible();
  });

  it("hides the 'Status' column", async () => {
    render(<DataGridWithHideShow />);
    expect(screen.getByTestId("datagrid-header-status")).toBeVisible();
    const user = userEvent.setup();
    await act(() =>
      user.click(screen.getByTestId("datagrid-hide-show-button")),
    );
    // Because we need to click "Status" in "HideShow" instead of "Status" in the header.
    await act(() => user.click(screen.getByTestId("hide-show-Status")));
    await act(() =>
      user.click(screen.getByTestId("datagrid-hide-show-button")),
    );
    await vi.waitFor(() => {
      expect(
        screen.queryByTestId("datagrid-header-status"),
      ).not.toBeInTheDocument();
    });
  });
});
