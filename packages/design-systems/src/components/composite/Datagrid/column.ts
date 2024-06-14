import { ColumnDef } from "@tanstack/table-core";

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

export type ColumnDefinition<TData extends Record<string, unknown>> = Array<
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
  } as const;
};

export const buildColumns = <TData extends Record<string, unknown>>(
  columns: ReadonlyArray<Column<TData>>,
): Array<ColumnDef<TData>> => {
  return columns.map((column) => {
    const columnDef: ColumnDef<TData> = {
      accessorKey: column.key,
      header: column.header,
      size: column.columnOptions?.size,
      meta: {
        type: column.meta.type,
      },
    };

    return columnDef;
  });
};

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
