import type { Updater } from "@tanstack/table-core";
import type { Localization } from "..";

export type ExportState = {
  enableCsvExport?: boolean;
};

export interface ExportTableState {
  exportOptions: ExportState;
  exportOpen: boolean;
}

export interface ExportOptions {}

export interface ExportInstance {
  setExportOpen: (updater: Updater<boolean>) => void;
  getEnableExport: () => boolean;
  exportCsv: () => void;
}

export type ExportProps = {
  exportOptions?: ExportState;
  localization: Localization;
  exportCsv: () => void;
  exportOpen: boolean;
  setExportOpen: (updater: Updater<boolean>) => void;
};
