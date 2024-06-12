import { describe, test, expect } from "vitest";
import { newQueryBuilder } from "./queryBuilder";

describe("filterQuery", () => {
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
    hasJob: boolean;
  };

  const { query, ops } = newQueryBuilder<S>({
    columns: mockColumns,
  });

  test("should return the correct query", () => {
    const q = query({
      // add extra spaces to test the trimming
      name: ops.string.eq("John  "),
      hasJob: ops.boolean.eq(true),
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
      hasJob: {
        eq: true,
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
