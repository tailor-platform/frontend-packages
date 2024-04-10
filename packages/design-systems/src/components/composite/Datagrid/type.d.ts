import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: string;
    enumType?: Record<string, string>;
  }
}
