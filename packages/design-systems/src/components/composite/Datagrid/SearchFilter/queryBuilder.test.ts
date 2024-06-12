import { describe, test, expect } from "vitest";
import { newQueryBuilder } from "./queryBuilder";

describe("filterQuery", () => {
  test("should return the correct query", () => {
    const mockColumns = [
      {
        accessorKey: "name",
        meta: {
          type: "string",
        },
      },
      {
        accessorKey: "age",
        meta: {
          type: "number",
        },
      },
      {
        accessorKey: "hasJob",
        meta: {
          type: "boolean",
        },
      },
    ] as const;

    type S = {
      name: string;
      age: number;
    };

    const { query, ops } = newQueryBuilder<S>({
      columns: mockColumns,
    });

    const q = query({
      name: ops.string.eq("John"),
    }).and([
      query({
        age: ops.number.gt(10),
      }),
      query({
        age: ops.number.lt(20),
      }),
    ]);

    expect(q.build()).toStrictEqual({
      name: {
        eq: "John",
      },
      and: [
        {
          age: {
            gt: 10,
          },
        },
        {
          age: {
            lt: 20,
          },
        },
      ],
    });
  });
});
