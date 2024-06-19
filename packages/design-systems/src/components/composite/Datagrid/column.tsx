import {
  AccessorColumnDef,
  CellContext,
  ColumnDef,
  DisplayColumnDef,
} from "@tanstack/table-core";
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

type CommonColumnOptions = {
  size?: number;
  maxSize?: number;
  resizable?: boolean;
};
type CommonColumn = {
  header: string;
};

export type Column<TData extends Record<string, unknown>> =
  | KeyedColumn<TData>
  | IDColumn<TData>;

export type Columns<TData extends Record<string, unknown>> = ReadonlyArray<
  Column<TData>
>;

/**
 * KeyedColumn is a column definition that has a key to access the data, even the nested one.
 * This is finally converted into `AccessorColumnDef` in react-table
 */
type KeyedColumn<TData extends Record<string, unknown>> = CommonColumn & {
  key: NestedKeyOf<TData>;
  meta: ColumnMeta;
  options?: KeyedColumnOptions<TData>;
};
type KeyedColumnOptions<TData extends Record<string, unknown>> =
  CommonColumnOptions & {
    render?: (props: CellContext<TData, unknown>) => React.ReactNode;
  };

/**
 * IDColumn is a special column that does not have a key but an ID
 * This is finally converted into `DisplayColumnDef` in react-table
 */
type IDColumn<TData extends Record<string, unknown>> = CommonColumn & {
  id: string;
  options: IDColumnOptions<TData>;
};
type IDColumnOptions<TData extends Record<string, unknown>> =
  CommonColumnOptions & {
    render: (props: CellContext<TData, unknown>) => React.ReactNode;
  };

/**
 * newColumnBuilder is a factory function to create a column builder
 * that provides a type-safe way to define columns for the datagrid.
 *
 * The following is an example of how to use the newColumnBuilder:
 *
 * ```
 * type User = {
 *   name: string;
 *   age: number | null;
 * };
 *
 * const columnBuilder = newColumnBuilder<User>();
 * const columns = [
 *   columnBuilder.string("name", "Name")
 *   columnBuilder.number("age", "Age")
 * ]
 *
 * const table = useDataGrid({
 *   columns,
 * });
 * ```
 */
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

    dateTime: <Key extends NestedKeyOf<TData>>(
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

/**
 * buildColumns is a utility function to convert the column definitions into the react-table column definitions.
 */
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

  const toReactTableAccessorColumnDef = <C extends KeyedColumn<TData>>(
    column: C,
  ) => {
    const aColumn: AccessorColumnDef<TData> = {
      accessorKey: column.key,
      header: column.header,
      size: column.options?.size,
      maxSize: column.options?.maxSize,
      enableResizing: column.options?.resizable,
      meta: {
        type: column.meta.type,
        enumType:
          column.meta.type === "enum" ? column.meta.enumType : undefined,
      },
    };

    // Providing `undefined` to `cell` unexpectedly renders the cell as empty in the type of "boolean"
    // so we need to omit the `cell` key if the custom renderer is not provided
    if (column.options?.render) {
      aColumn.cell = column.options?.render;
    }

    return aColumn;
  };

  const toReactTableDisplayColumnDef = (column: IDColumn<TData>) => {
    const dColumn: DisplayColumnDef<TData> = {
      id: column.id,
      header: column.header,
      size: column.options?.size,
      maxSize: column.options?.maxSize,
      enableResizing: column.options?.resizable,
      cell: column.options?.render,
    };

    return dColumn;
  };

  return [
    ...checkboxColumn,
    ...columns.map((column) => {
      return "key" in column
        ? toReactTableAccessorColumnDef(column)
        : toReactTableDisplayColumnDef(column);
    }),
  ];
};
