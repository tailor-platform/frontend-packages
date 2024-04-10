import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: string;
    enumType?: Record<string, string>;
  }
}
