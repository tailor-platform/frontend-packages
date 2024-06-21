import type { Updater } from "@tanstack/table-core";
import type { Column, DataGridInstance } from "../types";
import { applicableTypes } from "./filter";
import { CollectionItem } from "@ark-ui/react/dist/types";

export type ValueChangeDetails<T extends CollectionItem = CollectionItem> = {
  value: string[];
  items: T[];
};

export type FilterRowState = {
  column: string;
  value: FilterValue;
  condition: string;
  jointCondition?: string;
  isChangeable: boolean;
};

export type ApplicableType = (typeof applicableTypes)[number];
export type JointCondition = {
  label: string;
  value: string;
  disabled: boolean;
};

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | null
  | undefined;
export type QueryFilterColumn = {
  [column: string]:
    | {
        [condition: string]: FilterValue;
      }
    | undefined;
};
export type QueryFilter =
  | QueryFilterColumn
  | {
      [jointCondition: string]: Array<QueryFilterColumn>;
    };

export type RootQueryFilter = {
  [and: string]: QueryFilter;
};

export interface CustomFilterTableState {
  customFilterOpen: boolean;
}

export interface CustomFilterOptions {
  enableCustomFilter?: boolean;
}

export interface CustomFilterInstance {
  setCustomFilterOpen: (updater: Updater<boolean>) => void;
}

export type CustomFilterProps<TData extends Record<string, unknown>> =
  CommonToolButtonProps<TData> & {
    columns: Array<Column<TData>>;
  };

export type CommonToolButtonProps<TData extends Record<string, unknown>> = {
  table: DataGridInstance<TData>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs";
  variant?: "primary" | "secondary" | "link" | "tertiary";
};
