import "@tanstack/react-table";
import { DensityTableState, DensityOptions, DensityInstance } from "./types";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: string;
    enumType?: Record<string, string>;
  }
  interface TableState extends DensityTableState {}
  interface TableOptionsResolved extends DensityOptions {}
  interface Table extends DensityInstance {}
}
