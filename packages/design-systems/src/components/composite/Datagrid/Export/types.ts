import type { Updater } from "@tanstack/table-core";
import { CommonToolButtonProps } from "../SearchFilter/types";

export type ExportState = {
  enableCsvExport?: boolean;
  omit?: string[];
};

export interface ExportTableState {
  exportOptions: ExportState;
  exportOpen: boolean;
}

export interface ExportOptions {
  exportOptions: ExportState;
}

export interface ExportInstance {
  setExportOpen: (updater: Updater<boolean>) => void;
  getEnableExport: () => boolean;
  exportCsv: () => void;
}

export type ExportProps<TData extends Record<string, unknown>> =
  CommonToolButtonProps<TData>;
