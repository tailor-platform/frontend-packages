import { CellContext, ColumnDef } from "@tanstack/table-core";
import { Checkbox } from "../../Checkbox";

type Maybe<T> = T | null | undefined;

/**
 * Utility type to extract nested keys from a nested object.
 *
 * For example, given the following type:
 *
 * ```
 * type User = {
 *   id: string;
 *   name: string;
 *   address?: {
 *     city: string;
 *   } | null;
 * }
 * ```
 *
 * The `NestedKeyOf<User>` will be:
 * - `id`
 * - `name`
 * - `address`
 * - `address.city`
 */
type NestedKeyOf<T extends Record<string, unknown>> = {
  [K in keyof T & string]: T[K] extends Maybe<Record<string, unknown>>
    ? T[K] extends Maybe<Record<string, unknown>>
      ? `${K}.${NestedKeyOf<NonNullable<T[K]>>}`
      : K
    : K;
}[keyof T & string];

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

type KeyedColumnOptions<TData extends Record<string, unknown>> = {
  size?: number;
  render?: (props: CellContext<TData, unknown>) => React.ReactNode;
};
type CommonColumn = {
  header: string;
};
type KeyedColumn<TData extends Record<string, unknown>> = CommonColumn & {
  key: NestedKeyOf<TData>;
  meta: ColumnMeta;
  options?: KeyedColumnOptions<TData>;
};
type IDColumnOptions<TData extends Record<string, unknown>> = {
  size?: number;
  render: (props: CellContext<TData, unknown>) => React.ReactNode;
};
type IDColumn<TData extends Record<string, unknown>> = CommonColumn & {
  id: string;
  options: IDColumnOptions<TData>;
};

export type Column<TData extends Record<string, unknown>> =
  | KeyedColumn<TData>
  | IDColumn<TData>;

export type Columns<TData extends Record<string, unknown>> = ReadonlyArray<
  Column<TData>
>;

export const newColumnBuilder = <TData extends Record<string, unknown>>() => {
  return {
    string: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
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

    uuid: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
    ) => {
      const meta = {
        type: "uuid",
      } as const;

      return {
        key,
        header,
        meta,
        options,
      };
    },

    number: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
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

    enum: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      values: Record<string, string>,
      options?: KeyedColumnOptions<TData>,
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

    boolean: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
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

    date: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
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

    time: <Key extends NestedKeyOf<TData>>(
      key: Key,
      header: string,
      options?: KeyedColumnOptions<TData>,
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
      options?: KeyedColumnOptions<TData>,
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

    custom: (id: string, header: string, options: IDColumnOptions<TData>) => {
      return {
        id,
        header,
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
export type ExtractMetaType<
  TData extends Record<string, unknown>,
  Columns extends ReadonlyArray<Column<TData>>,
> = {
  [K in Columns[number] extends Column<TData>
    ? Columns[number] extends KeyedColumn<TData>
      ? Columns[number]["key"]
      : never
    : never]: Columns[number] extends Column<TData>
    ? Columns[number] extends KeyedColumn<TData>
      ? Columns[number] extends { key: infer U extends keyof TData }
        ? U extends K
          ? Columns[number]["meta"]["type"]
          : never
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
    const columnDef: ColumnDef<TData> =
      "key" in column
        ? Object.assign(
            {
              accessorKey: column.key,
              header: column.header,
              size: column.options?.size,
              meta: {
                type: column.meta.type,
                enumType:
                  column.meta.type === "enum"
                    ? column.meta.enumType
                    : undefined,
              },
            },

            // Providing `undefined` to `cell` unexpectedly renders the cell as empty in the type of "boolean"
            // so we need to omit the `cell` key if the custom renderer is not provided
            column.options?.render
              ? {
                  cell: column.options?.render,
                }
              : {},
          )
        : {
            id: column.id,
            header: column.header,
            size: column.options?.size,
            cell: column.options?.render,
          };

    return columnDef;
  });

  return [...checkboxColumn, ...r];
};
