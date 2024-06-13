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
    expect(
      // Heads-up: some fields intentionally have extra spaces to test the trimming
      query({
        name: filterOp.string.eq("John  "),
        age: filterOp.number.gt(10),
      })
        .and([
          query({
            hasJob: filterOp.boolean.eq(true),
            groupID: filterOp.uuid.eq("b2c38958-feeb-4198-8b7b-14da2a67bce6"),
          }),
          query({
            groupID: filterOp.uuid.in([
              "b2c38958-feeb-4198-8b7b-14da2a67bce6",
              "846359a6-64cc-4e0c-bc1e-651a9c21ae53",
            ]),
          }),
          query({
            category: filterOp.enum.in(["   CATEGORY1", "CATEGORY2     "]),
            birthday: filterOp.date.eq("2021-01-01      "),
          }).or([
            query({
              createdAt: filterOp.dateTime.eq("    2021-10-05T12:30:15Z"),
            }),
            query({
              birthday: filterOp.date.between("2021-01-01", "2021-01-19"),
            }),
            query({
              workingTime: filterOp.time.eq("12:30   "),
            }),
          ]),
        ])
        .build(),
    ).toStrictEqual({
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
          groupID: {
            in: [
              "b2c38958-feeb-4198-8b7b-14da2a67bce6",
              "846359a6-64cc-4e0c-bc1e-651a9c21ae53",
            ],
          },
        },
        {
          category: {
            in: ["CATEGORY1", "CATEGORY2"],
          },
          birthday: {
            eq: "2021-01-01",
          },
          or: [
            {
              createdAt: {
                eq: "2021-10-05T12:30:15.000Z",
              },
            },
            {
              birthday: {
                between: {
                  min: "2021-01-01",
                  max: "2021-01-19",
                },
              },
            },
            {
              workingTime: {
                eq: "12:30",
              },
            },
          ],
        },
      ],
    });
  });

  describe("should raise an error when the invalid value is provided", () => {
    describe("uuid", () => {
      test("single (eq)", () => {
        expect(() =>
          query({
            groupID: filterOp.uuid.eq("this is invalid UUID"),
          }).build(),
        ).toThrowError("Invalid UUID format");
      });

      test("multiple (in)", () => {
        expect(() =>
          query({
            groupID: filterOp.uuid.in(["this is invalid UUID"]),
          }).build(),
        ).toThrowError("Invalid UUID format");
      });
    });

    describe("date", () => {
      test("single (eq)", () => {
        expect(() =>
          query({
            birthday: filterOp.date.eq("this is invalid date"),
          }).build(),
        ).toThrowError("Invalid format (expected: YYYY-MM-DD)");
      });

      test("multiple (in)", () => {
        expect(() =>
          query({
            birthday: filterOp.date.in(["this is invalid date"]),
          }).build(),
        ).toThrowError("Invalid format (expected: YYYY-MM-DD)");
      });
    });

    describe("time", () => {
      test("single (eq)", () => {
        expect(() =>
          query({
            workingTime: filterOp.time.eq("this is invalid time"),
          }).build(),
        ).toThrowError("Invalid format (expected: HH:mm)");
      });
      test("multiple (in)", () => {
        expect(() =>
          query({
            workingTime: filterOp.time.in(["this is invalid time"]),
          }).build(),
        ).toThrowError("Invalid format (expected: HH:mm)");
      });
    });

    describe("datetime", () => {
      test("single (eq)", () => {
        expect(() =>
          query({
            createdAt: filterOp.dateTime.eq("this is invalid datetime"),
          }).build(),
        ).toThrowError("Invalid format (expected: -)");
      });
      test("multiple (in)", () => {
        expect(() =>
          query({
            createdAt: filterOp.dateTime.in(["this is invalid datetime"]),
          }).build(),
        ).toThrowError("Invalid format (expected: -)");
      });
    });
  });
});
