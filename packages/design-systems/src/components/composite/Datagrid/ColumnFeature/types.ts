import type { Updater } from "@tanstack/table-core";
import { CommonToolButtonProps } from "../SearchFilter/types";

export interface HideShowTableState {
  hideShowOpen: boolean;
}

export interface HideShowOptions {
  enableHideShow?: boolean;
}

export interface HideShowInstance {
  setHideShowOpen: (updater: Updater<boolean>) => void;
}

export type HideShowProps<TData extends Record<string, unknown>> =
  CommonToolButtonProps<TData>;
