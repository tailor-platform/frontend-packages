import { cookies } from "next/headers";
import { SessionResult } from "@lib/types";

export const getServerSession = (): SessionResult => {
  const cookieStore = cookies();
  const tailorToken = cookieStore.get("tailor.token");

  return {
    token: tailorToken?.value || "",
  };
};

export { withAuth } from "./middleware";
