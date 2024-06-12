import { ColumnDef } from "@tanstack/table-core";

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

type FilterDefinition<TData extends Record<string, unknown>> = Partial<{
  [K in keyof TData]: TData[K] extends string
    ? StringOp
    : TData[K] extends number
      ? NumberOp
      : TData[K] extends boolean
        ? BooleanOp
        : never;
}>;

class FilterQuery<TData extends Record<string, unknown>> {
  // Branded as filter query
  private brand!: "filterQuery";

  private jointCondition?: {
    mode: "and" | "or";
    queries: Array<FilterQuery<TData>>;
  };

  constructor(
    private readonly props: {
      columns: ReadonlyArray<ColumnDef<TData>>;
      filter: FilterDefinition<TData>;
    },
  ) {}

  and(query: Array<FilterQuery<TData>>) {
    this.jointCondition = {
      mode: "and",
      queries: query,
    };
    return this;
  }

  or(query: Array<FilterQuery<TData>>) {
    this.jointCondition = {
      mode: "or",
      queries: query,
    };
    return this;
  }

  build(): Record<string, unknown> {
    // const fields = this.props.filter.map((filter) => filter.build());

    const fields = Object.keys(this.props.filter).reduce((acc, key) => {
      const filter = this.props.filter[key];
      return {
        ...acc,
        [key]: filter?.build(),
      };
    }, {});

    return Object.assign(
      fields,
      this.jointCondition
        ? {
            [this.jointCondition.mode]: this.jointCondition.queries.map(
              (query) => query.build(),
            ),
          }
        : {},
    );
  }
}

type UseFilterQueryProps<TData extends Record<string, unknown>> = {
  columns: ReadonlyArray<ColumnDef<TData>>;
};

export const newQueryBuilder = <TData extends Record<string, unknown>>(
  props: UseFilterQueryProps<TData>,
) => {
  const buildQuery = <
    // Prohibit empty object ({})
    T extends Record<string, never> extends T ? never : FilterDefinition<TData>,
  >(
    filter: T,
  ) => {
    return new FilterQuery<TData>({ columns: props.columns, filter });
  };

  return {
    query: buildQuery,
    ops: {
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
    },
  };
};
