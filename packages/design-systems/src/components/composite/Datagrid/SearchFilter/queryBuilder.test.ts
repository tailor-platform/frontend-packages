import { describe, test, expect } from "vitest";
import { filterOp, newQueryBuilder } from "./queryBuilder";

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

  const { query } = newQueryBuilder({
    columns: mockColumns,
  });

  test("should return the correct query", () => {
    const q = query({
      // add extra spaces to test the trimming
      name: filterOp.string.eq("John  "),
    }).and([
      query({
        hasJob: filterOp.boolean.eq(true),
      }),
      query({
        age: filterOp.number.gt(10),
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
          hasJob: {
            eq: true,
          },
        },
      ],
    });
  });
});
