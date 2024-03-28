import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { internalUnauthorizedPath } from "./middleware/internal";
import { SessionOption, SessionResult } from "@core/types";

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
