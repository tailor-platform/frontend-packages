import type { OnChangeFn, Updater } from "@tanstack/table-core";
import { CommonToolButtonProps } from "../SearchFilter/types";

export type DensityState = "sm" | "md" | "lg";
export interface DensityTableState {
  density: DensityState;
  densityOpen: boolean;
}

export interface DensityOptions {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void;
  setDensityOpen: (updater: Updater<boolean>) => void;
}

export type DensityProps<TData extends Record<string, unknown>> =
  CommonToolButtonProps<TData>;
