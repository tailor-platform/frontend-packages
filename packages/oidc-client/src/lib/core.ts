import { Config } from "./config";
import { Session, ErrorResponse } from "./types";

export const internalExchangeTokenForSession = async (
  config: Config,
  code: string,
): Promise<Session | ErrorResponse> => {
  const redirectUri = encodeURI(config.appUrl(config.loginCallbackPath()));
  const formData = new FormData();
  formData.append("code", code);
  formData.append("redirect_uri", redirectUri);
  const res = await fetch(config.apiUrl(config.tokenPath()), {
    method: "POST",
    body: formData,
  });

  return (await res.json()) as Session;
};
