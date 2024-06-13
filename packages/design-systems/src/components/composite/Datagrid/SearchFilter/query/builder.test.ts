import { describe, test, expect } from "vitest";
import { newQueryBuilder } from "./builder";

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
    {
      accessorKey: "groupID",
      meta: {
        type: "uuid",
      },
    },
    {
      accessorKey: "category",
      meta: {
        type: "enum",
        enumType: {
          CATEGORY1: "Category 1",
          CATEGORY2: "Category 2",
          CATEGORY3: "Category 3",
        },
      },
    },
    {
      accessorKey: "birthday",
      meta: {
        type: "date",
      },
    },
    {
      accessorKey: "createdAt",
      meta: {
        type: "dateTime",
      },
    },
    {
      accessorKey: "workingTime",
      meta: {
        type: "time",
      },
    },
  ] as const;

  const { query, filterOp } = newQueryBuilder({
    columns: mockColumns,
  });

  test("should return the correct query", () => {
    const q = query({
      // add extra spaces to test the trimming
      name: filterOp.string.eq("John  "),
      age: filterOp.number.gt(10),
    }).and([
      query({
        hasJob: filterOp.boolean.eq(true),
        groupID: filterOp.uuid.eq("b2c38958-feeb-4198-8b7b-14da2a67bce6"),
      }),
      query({
        category: filterOp.enum.eq("CATEGORY1"),
        birthday: filterOp.date.eq("2021-01-01"),
      }).or([
        query({
          createdAt: filterOp.dateTime.eq("2021-01-01T00:00:00Z"),
        }),
        query({
          workingTime: filterOp.time.eq("12:00:00"),
        }),
      ]),
    ]);

    expect(q.build()).toStrictEqual({
      name: {
        eq: "John",
      },
      age: {
        gt: 10,
      },
      and: [
        {
          hasJob: {
            eq: true,
          },
          groupID: {
            eq: "b2c38958-feeb-4198-8b7b-14da2a67bce6",
          },
        },
        {
          category: {
            eq: "CATEGORY1",
          },
          birthday: {
            eq: "2021-01-01",
          },
          or: [
            {
              createdAt: {
                eq: "2021-01-01T00:00:00Z",
              },
            },
            {
              workingTime: {
                eq: "12:00:00",
              },
            },
          ],
        },
      ],
    });
  });
});
