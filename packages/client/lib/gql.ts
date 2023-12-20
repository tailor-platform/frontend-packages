import { isApolloError } from "@apollo/client";

/**
 * A function to extract extended error codes from the response of TailorPF backend
 */
export const extractExtErrorCode = (err: Error): ExtErrorCode[] => {
  if (!isApolloError(err)) {
    return [];
  }

  /**
   * An example of error objects
   *
   * [
   *   {
   *     "message": "id or password is not match",
   *     "path": [
   *       "login"
   *     ],
   *     "extensions": {
   *       "code": "LoginFail"
   *     }
   *   }
   * ]
   */
  return err.graphQLErrors.flatMap((e) => {
    if (typeof e.extensions?.code !== "string") {
      return [];
    }
    const extErrorCodes = Object.values(ExtErrorCodes);
    const c = extErrorCodes.find((ee) => ee === e.extensions.code);
    return c ? [c] : [];
  });
};

/**
 * Error patterns
 * (ref: https://github.com/tailor-platform/platform-core-services/blob/develop/service/directory/graph/graphql_errors/graphql_error.go)
 */
export const ExtErrorCodes = {
  LoginFail: "LoginFail",
  LogoutFail: "LogoutFail",
  Required: "Required",
  InvalidValue: "InvalidValue",
  UserPasswordUpdateFail: "UserPasswordUpdateFail",
} as const;
export type ExtErrorCode = (typeof ExtErrorCodes)[keyof typeof ExtErrorCodes];
