import { ColumnDef } from "@tanstack/table-core";
import { Checkbox } from "../../Checkbox";

type ColumnMeta =
  | {
      type:
        | "string"
        | "number"
        | "boolean"
        | "uuid"
        | "date"
        | "dateTime"
        | "time";
    }
  | {
      type: "enum";
      enumType?: Record<string, string>;
    };

type ColumnOptions = {
  size?: number;
};

type Column<TData extends Record<string, unknown>> = {
  key: keyof TData;
  header: string;
  meta: ColumnMeta;
  columnOptions?: ColumnOptions;
};

export type Columns<TData extends Record<string, unknown>> = Array<
  Column<TData>
>;

export const newColumnBuilder = <TData extends Record<string, unknown>>() => {
  return {
    string: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "string",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    number: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "number",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    enum: <Key extends keyof TData>(
      key: Key,
      header: string,
      values: Record<string, string>,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "enum",
        enumType: values,
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    boolean: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "boolean",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    date: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "date",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    time: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "time",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    dateTime: <Key extends keyof TData>(
      key: Key,
      header: string,
      options?: ColumnOptions,
    ) => {
      const meta = {
        type: "dateTime",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },
  } as const;
};

/**
 * Utility type to extract column meta types from array of column definitions
 * that finally generates the object as the following structure:
 *
 * ```
 * {
 *   name: "string",
 *   groupID: "uuid",
 *   category: "enum"
 * }
 * ```
 *
 * The final structure is used to determine the type of filter operation
 * that can be applied to each column through the `FilterOp` utility type in builder module.
 */
export type ExtractTypes<
  TData extends Record<string, unknown>,
  Columns extends ReadonlyArray<Column<TData>>,
> = {
  [K in Columns[number] extends Column<TData>
    ? Columns[number]["key"]
    : never]: Columns[number] extends Column<TData>
    ? Columns[number] extends { key: infer U extends keyof TData }
      ? U extends K
        ? Columns[number]["meta"]["type"]
        : never
      : never
    : never;
};

export const buildColumns = <TData extends Record<string, unknown>>(
  columns: ReadonlyArray<Column<TData>>,
  enableRowSelection = false,
): Array<ColumnDef<TData>> => {
  const checkboxColumn: Array<ColumnDef<TData>> = enableRowSelection
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllRowsSelected()
              }
              onCheckedChange={(e: { checked: boolean }) =>
                table.getToggleAllRowsSelectedHandler()({
                  target: { checked: e.checked },
                })
              }
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(e: { checked: boolean }) =>
                row.getToggleSelectedHandler()(e.checked)
              }
            />
          ),
          size: 54,
        },
      ]
    : [];

  const r = columns.map((column) => {
    const columnDef: ColumnDef<TData> = {
      accessorKey: column.key,
      header: column.header,
      size: column.columnOptions?.size,
      meta: {
        type: column.meta.type,
        enumType:
          column.meta.type === "enum" ? column.meta.enumType : undefined,
      },
    };

    return columnDef;
  });

  return [...checkboxColumn, ...r];
};
