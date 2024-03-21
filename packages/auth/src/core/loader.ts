import { internalClientSessionPath } from "@server/middleware/internal";
import { Config } from "@core/config";
import { SessionResult } from "@core/types";

let internalClientSession: SessionResult | null = null;
export const getInternalClientSession = () => internalClientSession;
export const loadSession = async (config: Config) => {
  const rawResp = await fetch(config.appUrl(internalClientSessionPath));
  internalClientSession = (await rawResp.json()) as SessionResult;
};

// Clear session internally stored on memory (this is only for test usage)
export const clearClientSession = () => {
  internalClientSession = null;
};

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
};

let internalUserinfo: UserInfo | null = null;
export const getInternalUserinfo = () => internalUserinfo;
export const loadUserinfo = async (config: Config, session: SessionResult) => {
  const userInfoPath = config.userInfoPath();
  const res = await fetch(config.apiUrl(userInfoPath), {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });
  internalUserinfo = (await res.json()) as UserInfo;
};
