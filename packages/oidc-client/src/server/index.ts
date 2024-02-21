import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { internalUnauthorizedPath } from "./middleware/internal";
import { SessionOption, SessionResult } from "@lib/types";

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
