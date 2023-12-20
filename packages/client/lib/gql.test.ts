import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { ExtErrorCodes, extractExtErrorCode } from "./gql";

describe("GQL", () => {
  describe("extractExtErrorCode", () => {
    test("ignores invalid error codes", () => {
      const gqlError = new ApolloError({
        graphQLErrors: [
          new GraphQLError("error1", {
            extensions: {
              code: "Required",
            },
          }),
          new GraphQLError("error2", {
            extensions: {
              code: "InvalidValue",
            },
          }),
          new GraphQLError("error3", {
            extensions: {
              code: "ThisIsInvalidError",
            },
          }),
        ],
      });
      const errorCodes = extractExtErrorCode(gqlError);
      expect(errorCodes.length).toBe(2);
      expect(errorCodes).toContain(ExtErrorCodes.Required);
      expect(errorCodes).toContain(ExtErrorCodes.InvalidValue);
    });
  });
});
