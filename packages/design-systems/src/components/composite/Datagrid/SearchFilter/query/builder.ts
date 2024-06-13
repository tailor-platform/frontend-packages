import { ColumnDef } from "@tanstack/table-core";
import { Exact } from "type-fest";
import { NumberOp, BooleanOp, StringOp, Op, buildFilterOp } from "./predicates";

// Extract column meta types from array of column definitions
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

type FilterOp<MetaTypes extends Record<string, unknown>> = Partial<{
  [K in keyof MetaTypes]: MetaTypes[K] extends "number"
    ? NumberOp
    : MetaTypes[K] extends "boolean"
      ? BooleanOp
      : StringOp;
}>;

type JointCondition<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> = {
  mode: "and" | "or";
  queries: Array<ConjunctiveFilterQuery<Columns, F>>;
};

class BuildableFilterQuery<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> {
  // Branded as terminal filter query
  private brand!: "filterQuery";

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
            [jointCondition.mode]: jointCondition.queries.map((query) =>
              query.build(),
            ),
          }
        : {},
    );
  }
}

// ConjunctiveFilterQuery is a class that can be chained with and/or
// conjunctive methods always return a new instance of BuildableFilterQuery to prohibit chaining conjunctive methods
class ConjunctiveFilterQuery<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
  F extends Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
> extends BuildableFilterQuery<Columns, F> {
  and<
    P extends ConjunctiveFilterQuery<
      Columns,
      FilterOp<ExtractColumnMetaType<Columns>>
    >,
  >(queries: Array<P>) {
    return new BuildableFilterQuery({
      ...this.props,
      jointCondition: {
        mode: "and",
        queries,
      },
    });
  }

  or<
    P extends ConjunctiveFilterQuery<
      Columns,
      FilterOp<ExtractColumnMetaType<Columns>>
    >,
  >(queries: Array<P>) {
    return new BuildableFilterQuery({
      ...this.props,
      jointCondition: {
        mode: "or",
        queries,
      },
    });
  }
}

type UseFilterQueryProps<
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
> = {
  columns: Columns;
};

export const newQueryBuilder = <
  Columns extends ReadonlyArray<ColumnDef<Record<string, unknown>>>,
>(
  props: UseFilterQueryProps<Columns>,
) => {
  const buildQuery = <
    // Prohibit empty object ({})
    F extends Record<string, never> extends F
      ? never
      : Exact<FilterOp<ExtractColumnMetaType<Columns>>, F>,
  >(
    filter: F,
  ) => {
    return new ConjunctiveFilterQuery<Columns, F>({
      columns: props.columns,
      filter,
    });
  };

  return {
    query: buildQuery,
    filterOp: buildFilterOp(),
  };
};
