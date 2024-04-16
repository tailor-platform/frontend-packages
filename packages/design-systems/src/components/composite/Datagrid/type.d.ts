import "@tanstack/react-table";
import {
  DensityTableState,
  DensityOptions,
  DensityInstance,
  ExportTableState,
  ExportOptions,
  ExportInstance,
} from "./types";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: string;
    enumType?: Record<string, string>;
  }
  interface TableState extends DensityTableState, ExportTableState {}
  interface TableOptionsResolved extends DensityOptions, ExportOptions {}
  interface Table extends DensityInstance, ExportInstance {}
}
