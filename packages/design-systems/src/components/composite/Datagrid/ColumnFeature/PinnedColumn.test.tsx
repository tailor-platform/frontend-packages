import { act, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { LOCALIZATION_EN } from "../../../../locales/en";
import { useDataGrid } from "../useDataGrid";
import { DataGrid } from "../Datagrid";
import { newColumnBuilder } from "../column";
import { PinnedColumn } from "./PinnedColumn";

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

const PinnedColumnTest = () => {
  const table = useDataGrid({
    data,
    columns,
  });
  const tableColumns = table.getAllLeafColumns();

  return (
    <PinnedColumn localization={LOCALIZATION_EN} column={tableColumns[0]} />
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
  const thElements = screen.getAllByRole("columnheader");
  let indexOfThWithText = -1;
  thElements.forEach((thElement, index) => {
    if (thElement.textContent === text) {
      indexOfThWithText = index;
    }
  });
  expect(indexOfThWithText).toBeGreaterThan(-1);
  expect(indexOfThWithText).toBe(textIndex);
};

const conformPinnedThElementsIndex = async (
  text: string,
  pinnedText: string,
  afterThElementPosition: number,
) => {
  const targetElement = screen.getByRole("columnheader", {
    name: text + " Open Pinned Column Modal",
  });
  const element = within(targetElement).getByLabelText(
    "Open Pinned Column Modal",
  );
  expect(element).toBeInTheDocument();

  const user = userEvent.setup();
  await act(() => user.click(element));

  const pinnedElement = screen.getByText(pinnedText);
  await waitFor(() => expect(pinnedElement).toBeVisible());

  let indexOfThWithText = -1;
  await act(() => user.click(pinnedElement));
  const thElements = screen.getAllByRole("columnheader");
  thElements.forEach((thElement, index) => {
    if (thElement.textContent === text) {
      indexOfThWithText = index;
    }
  });
  await waitFor(() => expect(indexOfThWithText).toBeGreaterThan(-1));
  await waitFor(() => expect(indexOfThWithText).toBe(afterThElementPosition));
};

describe("<PinnedColumn />", () => {
  it("renders correctly", async () => {
    render(<PinnedColumnTest />);

    const user = userEvent.setup();
    const openPinnedColumnModal = screen.getAllByLabelText(
      "Open Pinned Column Modal",
    )[0];

    expect(openPinnedColumnModal).toBeInTheDocument();
    await act(() => user.click(openPinnedColumnModal));

    expect(await screen.findByText("Pinned Right")).toBeVisible();
    expect(await screen.findByText("Pinned Left")).toBeVisible();
  });

  it("pinned the 'Status' column to right and pinned the 'Amount' column to left", async () => {
    render(<DataGridWithPinnedColumn />);

    const targetElement = screen.getByRole("columnheader", {
      name: "Status Open Pinned Column Modal",
    });
    const element = within(targetElement).getByLabelText(
      "Open Pinned Column Modal",
    );
    expect(element).toBeInTheDocument();

    conformThElemntsIndex("Status", 0);
    conformThElemntsIndex("Amount", 2);

    await conformPinnedThElementsIndex("Status", "Pinned Right", 2);
    await conformPinnedThElementsIndex("Amount", "Pinned Left", 0);
  });
});
