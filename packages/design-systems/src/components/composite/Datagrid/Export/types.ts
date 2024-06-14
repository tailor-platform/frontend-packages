import type { Updater } from "@tanstack/table-core";
import { CommonToolButtonProps } from "../SearchFilter/types";

export type ExportState<TData extends Record<string, unknown>> = {
  enableCsvExport?: boolean;
  omit?: [keyof TData];
};

export interface ExportTableState<TData extends Record<string, unknown>> {
  exportOptions: ExportState<TData>;
  exportOpen: boolean;
}

export interface ExportOptions<TData extends Record<string, unknown>> {
  exportOptions: ExportState<TData>;
}

export interface ExportInstance {
  setExportOpen: (updater: Updater<boolean>) => void;
  getEnableExport: () => boolean;
  exportCsv: () => void;
}

export type ExportProps<TData extends Record<string, unknown>> =
  CommonToolButtonProps<TData>;
