import type { Updater } from "@tanstack/table-core";
import type { CollectionItem } from "@ark-ui/react";
import type { Column, DataGridInstance } from "../types";
import type { Localization } from "..";
import type { Column } from "../types";
import { applicableTypes } from "./filter";

export type ValueChangeDetails<T extends CollectionItem = CollectionItem> = {
  value: string[];
  items: T[];
};

export type FilterRowState = {
  column: string;
  value: QueryRowValue;
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

export type QueryRowValue = string | number | boolean | string[] | number[];
export type QueryRowColumn = {
  [column: string]: {
    [condition: string]: QueryRowValue;
  };
};
export type QueryRow =
  | QueryRowColumn
  | {
    [jointCondition: string]: Array<QueryRowColumn>;
  };

export type GraphQLQueryFilter = {
  [and: string]: QueryRow;
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
