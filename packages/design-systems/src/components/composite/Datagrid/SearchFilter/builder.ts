import { ColumnDef } from "@tanstack/table-core";
import { Exact } from "type-fest";
import { ApplicableType } from "./types";
import {
  NumberOp,
  BooleanOp,
  StringOp,
  Op,
  buildFilterOp,
  UUIDOp,
  EnumOp,
  TimeOp,
  DateOp,
  DateTimeOp,
} from "./filterOps";

/**
 * @deprecated
 */
type ExtractColumnMetaType<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
> = {
  [K in Columns[number] extends { accessorKey: infer U extends string }
    ? U
    : never]: Columns[number] extends { accessorKey: infer U extends string }
    ? U extends K
      ? Columns[number]["meta"] extends { type: string }
        ? Columns[number]["meta"]["type"]
        : never
      : never
    : never;
};

type FilterOp<MetaTypes extends Record<string, ApplicableType>> = Partial<{
  [K in keyof MetaTypes]: MetaTypes[K] extends "uuid"
    ? UUIDOp
    : MetaTypes[K] extends "enum"
      ? EnumOp
      : MetaTypes[K] extends "boolean"
        ? BooleanOp
        : MetaTypes[K] extends "number"
          ? NumberOp
          : MetaTypes[K] extends "time"
            ? TimeOp
            : MetaTypes[K] extends "date"
              ? DateOp
              : MetaTypes[K] extends "dateTime"
                ? DateTimeOp
                : StringOp;
}>;

type JointCondition<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> = {
  mode: "and" | "or";
  filters: Array<ConjunctiveFilter<Columns, F> | BuildableFilter<Columns, F>>;
};

class BuildableFilter<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> {
  // Branded as terminal filter
  private brand!: "filter";

  constructor(
    protected readonly props: {
      columns: Columns;
      filter: F;
      jointCondition?: JointCondition<Columns, F>;
    },
  ) {}

  build(): Record<string, unknown> {
    // TypeScript cannot infer the type of keys through Object.keys
    const keys = Object.keys(this.props.filter) as (keyof F)[];
    const fields = keys.reduce((acc, key) => {
      const filter = this.props.filter[key];
      return {
        ...acc,
        [key]: filter instanceof Op ? filter.build() : undefined,
      };
    }, {});

    const jointCondition = this.props.jointCondition;
    return Object.assign(
      fields,
      jointCondition
        ? {
            [jointCondition.mode]: jointCondition.filters.map((filter) =>
              filter.build(),
            ),
          }
        : {},
    );
  }
}

type ChainableFilter<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
> =
  | ConjunctiveFilter<Columns, FilterOp<ExtractColumnMetaType<Columns>>>
  | BuildableFilter<Columns, FilterOp<ExtractColumnMetaType<Columns>>>;

/**
 * ConjunctiveFilter is a class that can be chained with and/or
 * conjunctive methods always return a new instance of BuildableFilter to prohibit chaining conjunctive methods
 */
class ConjunctiveFilter<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> extends BuildableFilter<Columns, F> {
  and<P extends ChainableFilter<Columns>>(filters: Array<P>) {
    return new BuildableFilter({
      ...this.props,
      jointCondition: {
        mode: "and",
        filters,
      },
    });
  }

  or<P extends ChainableFilter<Columns>>(filters: Array<P>) {
    return new BuildableFilter({
      ...this.props,
      jointCondition: {
        mode: "or",
        filters,
      },
    });
  }
}

type NewFilterBuilderProps<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
> = {
  columns: Columns;
};

export const newFilterBuilder = <
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
>(
  props: NewFilterBuilderProps<Columns>,
) => {
  const buildFields = <
    // Prohibit empty object ({})
    F extends Record<string, never> extends F
      ? never
      : Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
  >(
    filter: F,
  ) => {
    return new ConjunctiveFilter<Columns, F>({
      columns: props.columns,
      filter,
    });
  };

  return {
    fields: buildFields,
    filterOp: buildFilterOp(),
  };
};
