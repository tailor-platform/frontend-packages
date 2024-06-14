import { User } from "lucide-react";
import { describe, expect, test } from "vitest";
import { screen, render } from "@testing-library/react";
import { buildColumns, newColumnBuilder } from "./column";
import { useDataGrid } from "./useDataGrid";
import { DataGrid } from ".";

type User = {
  id: string;
  name: string;
  age: number;
  category: string;
};

const columnBuilder = newColumnBuilder<User>();
const columns = [
  columnBuilder.string("name", "名前", {
    size: 120,
  }),
  columnBuilder.number("age", "年齢", {
    size: 100,
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
      size: 80,
    },
  ),
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
        header: "名前",
        size: 120,
        cell: undefined,
        meta: {
          type: "string",
          enumType: undefined,
        },
      },
      {
        accessorKey: "age",
        header: "年齢",
        size: 100,
        cell: undefined,
        meta: {
          type: "number",
          enumType: undefined,
        },
      },
      {
        accessorKey: "category",
        header: "カテゴリ",
        size: 80,
        cell: undefined,
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cell: expect.any(Function),
        header: "操作",
        id: "operation",
        size: 60,
      },
    ]);
  });
});
