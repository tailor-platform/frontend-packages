import { useState } from "react";
import { act, render, screen, within } from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { Payment, originData, setSortChange } from "../utils/test";
import { useDataGrid } from "../useDataGrid";
import { DataGrid } from "../Datagrid";
import { Order } from "../types";

enum PaymentStatus {
  pending = "pending",
  processing = "processing",
  success = "success",
  failed = "failed",
}

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
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    meta: {
      type: "date",
    },
  },
  {
    accessorKey: "isCreditCard",
    header: "CreditCardUsed",
    meta: {
      type: "boolean",
    },
  },
];
const DataGridWithSorting = () => {
  const table = useDataGrid({
    data: originData,
    columns,
    enableSorting: true,
    totalCount: 14,
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
    pageSizeOptions: [5, 10, 15, 20],
    enablePagination: true,
  });
  return <DataGrid table={table} />;
};

const DataGridWithManualSorting = () => {
  const pageSize = 8;
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
  return <DataGrid table={table} />;
};

describe("Sorting", () => {
  it("Sort by status", async () => {
    render(<DataGridWithSorting />);
    const user = userEvent.setup();

    const statusHeader = screen.getByText("Status");
    await act(async () => {
      await user.click(statusHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[3]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[4]).getByRole("cell", { name: "processing" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(statusHeader);
    });

    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "failed" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "failed" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "pending" }),
    ).toBeInTheDocument();
  });
  it("Sort by email", async () => {
    render(<DataGridWithSorting />);
    const user = userEvent.setup();

    const emailHeader = screen.getByText("Email");

    await act(async () => {
      await user.click(emailHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "sara@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "sara@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "m@example.com" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(emailHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "example1@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "example1@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "example2@example.com" }),
    ).toBeInTheDocument();
  });
  it("Sort by amount", async () => {
    render(<DataGridWithSorting />);
    const user = userEvent.setup();

    const amountHeader = screen.getByText("Amount");

    await act(async () => {
      await user.click(amountHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "500" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "500" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "400" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(amountHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "50" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "50" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "100" }),
    ).toBeInTheDocument();
  });
  it("Sort by createdAt", async () => {
    render(<DataGridWithSorting />);
    const user = userEvent.setup();

    const createdAtHeader = screen.getByText("CreatedAt");

    await act(async () => {
      await user.click(createdAtHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "2023-11-14" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "2023-11-14" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "2023-11-13" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(createdAtHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "2023-11-08" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "2023-11-08" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "2023-11-09" }),
    ).toBeInTheDocument();
  });
  it("Sort by CreditCardUsed", async () => {
    render(<DataGridWithSorting />);
    const user = userEvent.setup();

    const creditCardUsedHeader = screen.getByText("CreditCardUsed");

    await act(async () => {
      await user.click(creditCardUsedHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[3]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[4]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(creditCardUsedHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[3]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[4]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
  });
  it("ManualSort by status", async () => {
    render(<DataGridWithManualSorting />);
    const user = userEvent.setup();

    const statusHeader = screen.getByText("Status");
    await act(async () => {
      await user.click(statusHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[3]).getByRole("cell", { name: "success" }),
    ).toBeInTheDocument();
    expect(
      within(rows[4]).getByRole("cell", { name: "processing" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(statusHeader);
    });

    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "failed" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "failed" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "pending" }),
    ).toBeInTheDocument();
  });
  it("ManualSort by email", async () => {
    render(<DataGridWithManualSorting />);
    const user = userEvent.setup();

    const emailHeader = screen.getByText("Email");

    await act(async () => {
      await user.click(emailHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "sara@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "sara@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "m@example.com" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(emailHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "example1@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "example1@example.com" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "example2@example.com" }),
    ).toBeInTheDocument();
  });
  it("ManualSort by amount", async () => {
    render(<DataGridWithManualSorting />);
    const user = userEvent.setup();

    const amountHeader = screen.getByText("Amount");

    await act(async () => {
      await user.click(amountHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "500" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "500" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "400" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(amountHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "50" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "50" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "100" }),
    ).toBeInTheDocument();
  });
  it("ManualSort by createdAt", async () => {
    render(<DataGridWithManualSorting />);
    const user = userEvent.setup();

    const createdAtHeader = screen.getByText("CreatedAt");

    await act(async () => {
      await user.click(createdAtHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "2023-11-14" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "2023-11-14" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "2023-11-13" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(createdAtHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "2023-11-08" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "2023-11-08" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "2023-11-09" }),
    ).toBeInTheDocument();
  });
  it("ManualSort by CreditCardUsed", async () => {
    render(<DataGridWithManualSorting />);
    const user = userEvent.setup();

    const creditCardUsedHeader = screen.getByText("CreditCardUsed");

    await act(async () => {
      await user.click(creditCardUsedHeader);
    });
    const rows = screen.getAllByTestId("datagrid-row");
    expect(
      within(rows[0]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[2]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[3]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[4]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[5]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[6]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
    expect(
      within(rows[7]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();

    await act(async () => {
      await user.click(creditCardUsedHeader);
    });
    const ascRows = screen.getAllByTestId("datagrid-row");
    expect(
      within(ascRows[0]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[1]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[2]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[3]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[4]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[5]).getByRole("cell", { name: "false" }),
    ).toBeInTheDocument();
    expect(
      within(ascRows[6]).getByRole("cell", { name: "true" }),
    ).toBeInTheDocument();
  });
});
