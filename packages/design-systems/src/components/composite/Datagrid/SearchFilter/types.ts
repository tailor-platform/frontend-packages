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
  value: QueryRowValue;
  condition: string;
  jointCondition?: string;
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

type QueryRowValue = string | number | boolean | string[] | number[];
type QueryRowColumn = {
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

export type CustomFilterProps<TData> = {
  columns: Array<Column<TData>>;
  onChange: (currentState: GraphQLQueryFilter | undefined) => void;
  localization: Localization;
  systemFilter?: QueryRow;
  defaultFilter?: QueryRow;
  customFilterOpen: boolean;
  setCustomFilterOpen: (updater: Updater<boolean>) => void;
  enableColumnFilters?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs";
  variant?: "primary" | "secondary" | "link" | "tertiary";
};
