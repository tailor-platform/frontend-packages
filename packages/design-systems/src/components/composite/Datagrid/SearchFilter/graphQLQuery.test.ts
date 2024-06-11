import { describe, expect, it } from "vitest";
import { columns } from "../utils/test";
import { convertQueryFilter, generateGraphQLFilter } from "./graphQLQuery";
import { FilterRowState, QueryRow } from "./types";
import { LOCALIZATION_JA } from "@locales";

describe("useGraphQLQuery", () => {
  describe("convertQueryFilter", () => {
    it("works as expected with initial graphQLQueryObject", async () => {
      const queryObject: QueryRow = {};
      const filter: FilterRowState = {
        column: "amount",
        value: 200,
        condition: "eq",
        isChangeable: false,
        jointCondition: "or",
      };

      convertQueryFilter(LOCALIZATION_JA, filter, queryObject, "number");
      expect(queryObject).toStrictEqual({
        or: [
          {
            amount: {
              eq: 200,
            },
          },
        ],
      });
    });
  });

  describe("generateFilter", () => {
    it("works correctly with systemFilter", async () => {
      const systemFilter = { status: { eq: "pending" } };
      const expectedValue = {
        and: {
          status: { eq: "pending" },
        },
      };

      expect(
        generateGraphQLFilter({
          currentFilterRows: [],
          columns,
          systemFilter: systemFilter,
          localization: LOCALIZATION_JA,
        }),
      ).toStrictEqual(expectedValue);
    });

    it("works correctly with no filter", async () => {
      expect(
        generateGraphQLFilter({
          currentFilterRows: [],
          columns,
          systemFilter: undefined,
          localization: LOCALIZATION_JA,
        }),
      ).toStrictEqual(undefined);
    });

    it("works correctly with systemFilter which is empty object", async () => {
      expect(
        generateGraphQLFilter({
          currentFilterRows: [],
          columns,
          systemFilter: {},
          localization: LOCALIZATION_JA,
        }),
      ).toStrictEqual(undefined);
    });
  });
});
