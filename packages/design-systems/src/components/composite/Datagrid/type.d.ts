import "@tanstack/react-table";
import {
  DensityTableState,
  DensityOptions,
  DensityInstance,
  ExportTableState,
  ExportOptions,
  ExportInstance,
  HideShowTableState,
  HideShowOptions,
  HideShowInstance,
  CustomFilterTableState,
  CustomFilterOptions,
  CustomFilterInstance,
} from "./types";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: string;
    enumType?: Record<string, string>;
  }
  interface TableState
    extends CustomFilterTableState,
      HideShowTableState,
      DensityTableState,
      ExportTableState {}
  interface TableOptionsResolved
    extends CustomFilterOptions,
      HideShowOptions,
      DensityOptions,
      ExportOptions {}
  interface Table
    extends CustomFilterInstance,
      HideShowInstance,
      DensityInstance,
      ExportInstance {}
}
