export abstract class Op<const B, T, P extends { type: string; value: T }> {
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

export class StringOp extends Op<
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

export class UUIDOp extends Op<
  "uuidOp",
  string | string[],
  | {
      type: "eq" | "ne";
      value: string;
    }
  | {
      type: "in" | "nin";
      value: string[];
    }
> {
  override converter(value: string) {
    return value.trim();
  }
}

export class EnumOp extends Op<
  "enumOp",
  string | string[],
  | {
      type: "eq" | "ne";
      value: string;
    }
  | {
      type: "in" | "nin";
      value: string[];
    }
> {
  override converter(value: string) {
    return value.trim();
  }
}

export class NumberOp extends Op<
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

export class BooleanOp extends Op<
  "booleanOp",
  boolean,
  {
    type: "eq" | "ne";
    value: boolean;
  }
> {}

export class TimeOp extends Op<
  "timeOp",
  string | string[] | { min: string; max: string },
  | {
      type: "eq" | "ne" | "gt" | "gte" | "lt" | "lte";
      value: string;
    }
  | {
      type: "in" | "nin";
      value: string[];
    }
  | {
      type: "between";
      value: {
        min: string;
        max: string;
      };
    }
> {
  override converter(value: string) {
    return value.trim();
  }
}

export class DateTimeOp extends Op<
  "dateTimeOp",
  string | string[] | { min: string; max: string },
  | {
      type: "eq" | "ne" | "gt" | "gte" | "lt" | "lte";
      value: string;
    }
  | {
      type: "in" | "nin";
      value: string[];
    }
  | {
      type: "between";
      value: {
        min: string;
        max: string;
      };
    }
> {
  override converter(value: string) {
    return value.trim();
  }
}

export class DateOp extends Op<
  "dateOp",
  string | string[] | { min: string; max: string },
  | {
      type: "eq" | "ne" | "gt" | "gte" | "lt" | "lte";
      value: string;
    }
  | {
      type: "in" | "nin";
      value: string[];
    }
  | {
      type: "between";
      value: {
        min: string;
        max: string;
      };
    }
> {
  override converter(value: string) {
    return value.trim();
  }
}

export const buildFilterOp = () => {
  return {
    uuid: {
      eq: (value: string) => new UUIDOp({ value, type: "eq" }),
      ne: (value: string) => new UUIDOp({ value, type: "ne" }),
      in: (value: string[]) => new UUIDOp({ value, type: "in" }),
      nin: (value: string[]) => new UUIDOp({ value, type: "nin" }),
    },
    enum: {
      eq: (value: string) => new EnumOp({ value, type: "eq" }),
      ne: (value: string) => new EnumOp({ value, type: "ne" }),
      in: (value: string[]) => new EnumOp({ value, type: "in" }),
      nin: (value: string[]) => new EnumOp({ value, type: "nin" }),
    },
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
    time: {
      eq: (value: string) => new TimeOp({ value, type: "eq" }),
      ne: (value: string) => new TimeOp({ value, type: "ne" }),
      gt: (value: string) => new TimeOp({ value, type: "gt" }),
      gte: (value: string) => new TimeOp({ value, type: "gte" }),
      lt: (value: string) => new TimeOp({ value, type: "lt" }),
      lte: (value: string) => new TimeOp({ value, type: "lte" }),
      in: (value: string[]) => new TimeOp({ value, type: "in" }),
      nin: (value: string[]) => new TimeOp({ value, type: "nin" }),
      between: (min: string, max: string) =>
        new TimeOp({ value: { min, max }, type: "between" }),
    },
    date: {
      eq: (value: string) => new DateOp({ value, type: "eq" }),
      ne: (value: string) => new DateOp({ value, type: "ne" }),
      gt: (value: string) => new DateOp({ value, type: "gt" }),
      gte: (value: string) => new DateOp({ value, type: "gte" }),
      lt: (value: string) => new DateOp({ value, type: "lt" }),
      lte: (value: string) => new DateOp({ value, type: "lte" }),
      in: (value: string[]) => new DateOp({ value, type: "in" }),
      nin: (value: string[]) => new DateOp({ value, type: "nin" }),
      between: (min: string, max: string) =>
        new DateOp({ value: { min, max }, type: "between" }),
    },
    dateTime: {
      eq: (value: string) => new DateTimeOp({ value, type: "eq" }),
      ne: (value: string) => new DateTimeOp({ value, type: "ne" }),
      gt: (value: string) => new DateTimeOp({ value, type: "gt" }),
      gte: (value: string) => new DateTimeOp({ value, type: "gte" }),
      lt: (value: string) => new DateTimeOp({ value, type: "lt" }),
      lte: (value: string) => new DateTimeOp({ value, type: "lte" }),
      in: (value: string[]) => new DateTimeOp({ value, type: "in" }),
      nin: (value: string[]) => new DateTimeOp({ value, type: "nin" }),
      between: (min: string, max: string) =>
        new DateTimeOp({ value: { min, max }, type: "between" }),
    },
  };
};
