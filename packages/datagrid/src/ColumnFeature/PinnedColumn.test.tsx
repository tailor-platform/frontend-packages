import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PinnedColumn } from "./PinnedColumn";
import { useDataGrid } from "../useDataGrid";
import { Localization_EN } from "../locales/en";
import { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "../Datagrid";
import userEvent from "@testing-library/user-event";

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

const PinnedColumnTest = () => {
  const table = useDataGrid({
    data,
    columns,
    enableHiding: true,
  });
  return (
    <PinnedColumn
      localization={Localization_EN}
      setColumnPinning={(position) => {
        // header.column.pin(`${position}`)
        console.log('position')
      }}
    />
  );
};

const DataGridWithPinnedColumn = () => {
  const table = useDataGrid({
    data,
    columns,
    enableHiding: true,
  });
  return <DataGrid table={table} />;
};

const conformThElemntsIndex = (text: string, textIndex: number) => {
  const thElements = screen.getAllByRole('columnheader')
  let indexOfThWithText = -1;
  thElements.forEach((thElement, index) => {
    if (thElement.textContent === text) {
      indexOfThWithText = index;
    }
  });
  expect(indexOfThWithText).toBeGreaterThan(-1);
  expect(indexOfThWithText).toBe(textIndex)
}

describe("<PinnedColumn />", () => {
  it("renders correctly", async () => {
    render(<PinnedColumnTest />);
    
    const user = userEvent.setup();    
    const openPinnedColumnModal = screen.getAllByTestId("open-pinned-column-modal")[0];
    await user.click(openPinnedColumnModal);

    expect(screen.getByText("Pinned Right")).toBeVisible();
    expect(screen.getByText("Pinned Left")).toBeVisible();
  });

  it("pinned the 'Status' column to right and pinned the 'Amount' column to left", async () => {
    render(<DataGridWithPinnedColumn />);
    const user = userEvent.setup();

    // const thElements = screen.getAllByRole('columnheader')
    let indexOfThWithStatusText = -1;
    let indexOfThWithAmountText = -1;
    // thElements.forEach((thElement, index) => {
    //   if (thElement.textContent === 'Status') {
    //     indexOfThWithStatusText = index;
    //   }
    // });
    // thElements.forEach((thElement, index) => {
    //   if (thElement.textContent === 'Amount') {
    //     indexOfThWithAmountText = index;
    //   }
    // });
    // expect(indexOfThWithStatusText).toBeGreaterThan(-1);
    // expect(indexOfThWithStatusText).toBe(0)
    // expect(indexOfThWithAmountText).toBeGreaterThan(-1);
    // expect(indexOfThWithAmountText).toBe(2)

    conformThElemntsIndex("Status", 0)
    conformThElemntsIndex("Amount", 2)

    // Status click
    const targetElement = screen.getByText("Status");
    const element = within(targetElement).getByTestId("open-pinned-column-modal");
    expect(element).toBeInTheDocument()
    await user.click(element)

    const pinnedRightElement = screen.getByText("Pinned Right")
    const pinnedLeftElement = screen.getByText("Pinned Left")
    expect(pinnedRightElement).toBeVisible();
    expect(pinnedLeftElement).toBeVisible();

    await user.click(pinnedRightElement)
    const afterThElements = screen.getAllByRole('columnheader')
    afterThElements.forEach((thElement, index) => {
      if (thElement.textContent === 'Status') {
        indexOfThWithStatusText = index;
      }
    });
    expect(indexOfThWithStatusText).toBeGreaterThan(-1);
    expect(indexOfThWithStatusText).toBe(2)

    // Amount click
    const targetAmountElement = screen.getByText("Amount");
    const amountElement = within(targetAmountElement).getByTestId("open-pinned-column-modal");
    expect(amountElement).toBeInTheDocument()
    await user.click(amountElement)

    const pinnedRightAmountElement = screen.getByText("Pinned Right")
    const pinnedLeftAmountElement = screen.getByText("Pinned Left")
    expect(pinnedRightAmountElement).toBeVisible();
    expect(pinnedLeftAmountElement).toBeVisible();

    await user.click(pinnedLeftAmountElement)
    const afterAmountThElements = screen.getAllByRole('columnheader')
    afterAmountThElements.forEach((thElement, index) => {
      if (thElement.textContent === 'Amount') {
        indexOfThWithAmountText = index;
      }
    });
    expect(indexOfThWithAmountText).toBeGreaterThan(-1);
    expect(indexOfThWithAmountText).toBe(0)

  });
});
