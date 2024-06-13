import { ColumnDef } from "@tanstack/table-core";
import { Exact } from "type-fest";

class Op<const B, T, P extends { type: string; value: T }> {
  private brand!: B;

  constructor(private readonly props: P) {}

  build() {
    return {
      [this.props.type]: this.converter(this.props.value),
    };
  }

  protected converter(value: T) {
    return value;
  }
}

class StringOp extends Op<
  "stringOp",
  string,
  {
    value: string;
    type: "eq" | "ne" | "contains" | "regex";
  }
> {
  override converter(value: string) {
    return value.trim();
  }
}

class NumberOp extends Op<
  "numberOp",
  number | number[] | { min: number; max: number },
  | {
      type: "eq" | "ne" | "gt" | "gte" | "lt" | "lte";
      value: number;
    }
  | {
      type: "in" | "nin";
      value: number[];
    }
  | {
      type: "between";
      value: {
        min: number;
        max: number;
      };
    }
> {}

class BooleanOp extends Op<
  "booleanOp",
  boolean,
  {
    type: "eq" | "ne";
    value: boolean;
  }
> {}

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
    // TypeScript cannot infer the type of types in complicated operation of reduce
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
  and(queries: Array<ConjunctiveFilterQuery<Columns, F>>) {
    return new BuildableFilterQuery({
      ...this.props,
      jointCondition: {
        mode: "and",
        queries,
      },
    });
  }

  or(queries: Array<ConjunctiveFilterQuery<Columns, F>>) {
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
    T extends Record<string, never> extends T
      ? never
      : Exact<FilterOp<ExtractColumnMetaType<Columns>>, T>,
  >(
    filter: T,
  ) => {
    return new ConjunctiveFilterQuery<Columns, T>({
      columns: props.columns,
      filter,
    });
  };

  return {
    query: buildQuery,
  };
};

export const filterOp = {
  boolean: {
    eq: (value: boolean) => new BooleanOp({ value, type: "eq" }),
    ne: (value: boolean) => new BooleanOp({ value, type: "ne" }),
  },
  string: {
    eq: (value: string) => new StringOp({ value, type: "eq" }),
    ne: (value: string) => new StringOp({ value, type: "ne" }),
    contains: (value: string) => new StringOp({ value, type: "contains" }),
    regex: (value: string) => new StringOp({ value, type: "regex" }),
  },
  number: {
    eq: (value: number) => new NumberOp({ value, type: "eq" }),
    ne: (value: number) => new NumberOp({ value, type: "ne" }),
    in: (value: Array<number>) => new NumberOp({ value, type: "in" }),
    nin: (value: Array<number>) => new NumberOp({ value, type: "nin" }),
    gt: (value: number) => new NumberOp({ value, type: "gt" }),
    gte: (value: number) => new NumberOp({ value, type: "gte" }),
    lt: (value: number) => new NumberOp({ value, type: "lt" }),
    lte: (value: number) => new NumberOp({ value, type: "lte" }),
    between: (min: number, max: number) =>
      new NumberOp({ value: { min, max }, type: "between" }),
  },
};
