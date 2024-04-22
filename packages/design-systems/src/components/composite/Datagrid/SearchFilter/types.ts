import type { Updater } from "@tanstack/table-core";
import type { CollectionItem } from "@ark-ui/react";
import type { Localization } from "..";
import type { Column } from "../types";

export type ValueChangeDetails<T extends CollectionItem = CollectionItem> = {
  value: string[];
  items: T[];
};

export type FilterRowState = {
  column: string;
  value: string;
  condition: string;
  jointCondition?: string;
  isSystem: boolean;
  isChangeable: boolean;
};

export type ApplicableType =
  | "string"
  | "enum"
  | "time"
  | "dateTime"
  | "date"
  | "number"
  | "boolean";

export type JointCondition = {
  label: string;
  value: string;
  disabled: boolean;
};

export type GraphQLQueryFilter = {
  [fieldName: string]: { [operator: string]: unknown } | GraphQLQueryFilter;
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

export type CustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter) => void;
  localization: Localization;
  systemFilter?: GraphQLQueryFilter;
  defaultFilter?: GraphQLQueryFilter;
  customFilterOpen: boolean;
  setCustomFilterOpen: (updater: Updater<boolean>) => void;
};
