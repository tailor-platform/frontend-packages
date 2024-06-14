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

describe("column builder", () => {
  const columnBuilder = newColumnBuilder<User>();
  const columnDefs = [
    columnBuilder.string("name", "名前", {
      size: 120,
    }),
    columnBuilder.number("age", "年齢"),
    columnBuilder.enum("category", "カテゴリ", {
      CATEGORY1: "Category 1",
      CATEGORY2: "Category 2",
      CATEGORY3: "Category 3",
    }),
  ];

  const DataGridComponent = () => {
    const table = useDataGrid({
      data: [],
      columns: buildColumns<User>(columnDefs),
    });

    return <DataGrid table={table} />;
  };

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
