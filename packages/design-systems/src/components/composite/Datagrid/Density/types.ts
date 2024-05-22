import type { OnChangeFn, Updater } from "@tanstack/table-core";
import type { Localization } from "..";

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

export type DensityProps = {
  setDensity: (updater: Updater<DensityState>) => void;
  localization: Localization;
  densityOpen: boolean;
  setDensityOpen: (updater: Updater<boolean>) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs";
  variant?: "primary" | "secondary" | "link" | "tertiary";
};
