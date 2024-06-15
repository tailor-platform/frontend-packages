import { Exact } from "type-fest";
import { Columns, ExtractMetaType } from "../column";
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
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
  F extends Exact<FilterOp<ExtractMetaType<TData, C>>, F>,
> = {
  mode: "and" | "or";
  filters: Array<ConjunctiveFilter<TData, C, F> | BuildableFilter<TData, C, F>>;
};

class BuildableFilter<
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
  F extends Exact<FilterOp<ExtractMetaType<TData, C>>, F>,
> {
  // Branded as terminal filter
  private brand!: "filter";

  constructor(
    protected readonly props: {
      columns: C;
      filter: F;
      jointCondition?: JointCondition<TData, C, F>;
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
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
> =
  | ConjunctiveFilter<TData, C, FilterOp<ExtractMetaType<TData, C>>>
  | BuildableFilter<TData, C, FilterOp<ExtractMetaType<TData, C>>>;

/**
 * ConjunctiveFilter is a class that can be chained with and/or
 * conjunctive methods always return a new instance of BuildableFilter to prohibit chaining conjunctive methods
 */
class ConjunctiveFilter<
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
  F extends Exact<FilterOp<ExtractMetaType<TData, C>>, F>,
> extends BuildableFilter<TData, C, F> {
  and<P extends ChainableFilter<TData, C>>(filters: Array<P>) {
    return new BuildableFilter({
      ...this.props,
      jointCondition: {
        mode: "and",
        filters,
      },
    });
  }

  or<P extends ChainableFilter<TData, C>>(filters: Array<P>) {
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
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
> = {
  columns: C;
};

export const newFilterBuilder = <
  TData extends Record<string, unknown>,
  C extends Columns<TData>,
>(
  props: NewFilterBuilderProps<TData, C>,
) => {
  const buildFields = <
    // Prohibit empty object ({})
    F extends Record<string, never> extends F
      ? never
      : Exact<FilterOp<ExtractMetaType<TData, C>>, F>,
  >(
    filter: F,
  ) => {
    return new ConjunctiveFilter<TData, C, F>({
      columns: props.columns,
      filter,
    });
  };

  return {
    fields: buildFields,
    filterOp: buildFilterOp(),
  };
};
