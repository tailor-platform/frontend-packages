import type { Column, Updater } from "@tanstack/table-core";
import type { Localization } from "..";

export interface HideShowTableState {
  hideShowOpen: boolean;
}

export interface HideShowOptions {
  enableHideShow?: boolean;
}

export interface HideShowInstance {
  setHideShowOpen: (updater: Updater<boolean>) => void;
}

export type HideShowProps<TData extends Record<string, unknown>> = {
  allColumnsHandler: () => (event: unknown) => void;
  columns: Array<Column<TData>>;
  localization: Localization;
  hideShowOpen: boolean;
  setHideShowOpen: (updater: Updater<boolean>) => void;
};
