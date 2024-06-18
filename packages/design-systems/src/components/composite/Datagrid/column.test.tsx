import { describe, expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import { buildColumns, newColumnBuilder } from "./column";
import { useDataGrid } from "./useDataGrid";
import { DataGrid } from ".";

type User = {
  id: string;
  name: string;
  age?: number | null;
  category: string;
  email: string;
  address?: {
    city: string;
    country: string;
  } | null;
};

const columnBuilder = newColumnBuilder<User>();
const columns = [
  columnBuilder.string("name", "名前", {
    size: 120,
    maxSize: 200,
  }),
  columnBuilder.number("age", "年齢", {
    size: 100,
    maxSize: 150,
    resizable: true,
  }),
  columnBuilder.enum(
    "category",
    "カテゴリ",
    {
      CATEGORY1: "Category 1",
      CATEGORY2: "Category 2",
      CATEGORY3: "Category 3",
    },
    {
      maxSize: 80,
    },
  ),
  columnBuilder.string("email", "Email", {
    render: (props) => {
      return <div>Email: ${props.getValue() as string}</div>;
    },
  }),
  columnBuilder.string("address.city", "City"),
  columnBuilder.custom("operation", "操作", {
    size: 60,
    render: () => {
      return "custom operation";
    },
  }),
];

const DataGridComponent = () => {
  const table = useDataGrid({
    data: [],
    columns,
  });

  return <DataGrid table={table} />;
};

describe("newColumnBuilder", () => {
  test("should render a table from column definition", () => {
    render(<DataGridComponent />);

    ["名前", "年齢", "カテゴリ"].forEach((header) => {
      expect(
        screen.getByRole("columnheader", {
          name: new RegExp(header),
        }),
      ).toBeInTheDocument();
    });
  });
});

describe("buildColumns", () => {
  test("should build valid columns", () => {
    expect(buildColumns(columns)).toStrictEqual([
      {
        accessorKey: "name",
        enableResizing: undefined,
        header: "名前",
        size: 120,
        maxSize: 200,
        meta: {
          type: "string",
          enumType: undefined,
        },
      },
      {
        accessorKey: "age",
        enableResizing: true,
        header: "年齢",
        size: 100,
        maxSize: 150,
        meta: {
          type: "number",
          enumType: undefined,
        },
      },
      {
        accessorKey: "category",
        enableResizing: undefined,
        header: "カテゴリ",
        size: undefined,
        maxSize: 80,
        meta: {
          type: "enum",
          enumType: {
            CATEGORY1: "Category 1",
            CATEGORY2: "Category 2",
            CATEGORY3: "Category 3",
          },
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cell: expect.any(Function),
        size: undefined,
        maxSize: undefined,
        enableResizing: undefined,
        meta: {
          type: "string",
          enumType: undefined,
        },
      },
      {
        accessorKey: "address.city",
        header: "City",
        size: undefined,
        maxSize: undefined,
        enableResizing: undefined,
        meta: {
          type: "string",
          enumType: undefined,
        },
      },
      {
        id: "operation",
        header: "操作",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cell: expect.any(Function),
        size: 60,
        maxSize: undefined,
        enableResizing: undefined,
      },
    ]);
  });
});
