/**
 * `@tailor-platform/auth/server` is a package that provides a set of functions for server components and middlewares
 *
 * @packageDocumentation
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionOption, SessionResult } from "@core/types";
import { internalUnauthorizedPath } from "@core/path";

/**
 * A function to get token on server components
 *
 * @example
 * ```
 * import { getServerSession } from "@tailor-platform/auth/server";
 *
 * const Page = () => {
 *   const session = getServerSession();
 *
 *   return <div>Token: {session.token}</div>;
 * };
 * ```
 */
export const getServerSession = (options?: SessionOption): SessionResult => {
  const cookieStore = cookies();
  const tailorToken = cookieStore.get("tailor.token");

  if (options?.required && tailorToken?.value === undefined) {
    redirect(internalUnauthorizedPath);
  }

  return {
    token: tailorToken?.value || "",
  };
};

export { withAuth } from "./middleware";
