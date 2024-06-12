import { ColumnDef } from "@tanstack/table-core";

class Op<const T, P extends { type: string; value: unknown }> {
  private brand!: T;

  constructor(private readonly props: P) {}

  build() {
    return {
      [this.props.type]: this.props.value,
    };
  }
}

class StringOp extends Op<
  "stringOp",
  {
    value: string;
    type: "eq" | "ne" | "contains" | "regex";
  }
> {}

const buildStringOps = <T extends string>() => {
  return {
    eq: (value: T) => new StringOp({ value, type: "eq" }),
    ne: (value: T) => new StringOp({ value, type: "ne" }),
    contains: (value: T) => new StringOp({ value, type: "contains" }),
    regex: (value: T) => new StringOp({ value, type: "regex" }),
  };
};

class NumberOp extends Op<
  "numberOp",
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

const buildNumberOps = <T extends number>() => {
  return {
    eq: (value: T) => new NumberOp({ value, type: "eq" }),
    ne: (value: T) => new NumberOp({ value, type: "ne" }),
    in: (value: Array<T>) => new NumberOp({ value, type: "in" }),
    nin: (value: Array<T>) => new NumberOp({ value, type: "nin" }),
    gt: (value: T) => new NumberOp({ value, type: "gt" }),
    gte: (value: T) => new NumberOp({ value, type: "gte" }),
    lt: (value: T) => new NumberOp({ value, type: "lt" }),
    lte: (value: T) => new NumberOp({ value, type: "lte" }),
    between: (min: T, max: T) =>
      new NumberOp({ value: { min, max }, type: "between" }),
  };
};

type FilterDefinition<TData extends Record<string, unknown>> = Partial<{
  [K in keyof TData]: TData[K] extends string
    ? StringOp
    : TData[K] extends number
      ? NumberOp
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
      string: buildStringOps<string>(),
      number: buildNumberOps<number>(),
    },
  };
};
