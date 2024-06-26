import "@tanstack/react-table";
import {
  CustomFilterTableState,
  CustomFilterOptions,
  CustomFilterInstance,
  ApplicableType,
} from "./SearchFilter/types";
import type {
  DensityTableState,
  DensityOptions,
  DensityInstance,
} from "./Density/types";
import type {
  ExportTableState,
  ExportOptions,
  ExportInstance,
} from "./Export/types";
import type {
  HideShowTableState,
  HideShowOptions,
  HideShowInstance,
} from "./ColumnFeature/types";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    type: ApplicableType;
    enumType?: Record<string, string>;
  }
  interface TableState
    extends CustomFilterTableState,
      HideShowTableState,
      DensityTableState,
      ExportTableState<TData> {}
  interface TableOptionsResolved<TData extends Record<string, unknown>>
    extends CustomFilterOptions,
      HideShowOptions,
      DensityOptions,
      ExportOptions<TData> {}
  interface Table
    extends CustomFilterInstance,
      HideShowInstance,
      DensityInstance,
      ExportInstance {}
}
