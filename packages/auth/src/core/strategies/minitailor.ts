import { AbstractStrategy } from "./abstract";
import { paramsError } from "@server/middleware/callback";
import { Config } from "@core/config";

type Options = {
  email: string;
  redirectPath: string;
};

export class MinitailorStrategy implements AbstractStrategy<Options> {
  name() {
    return "minitailor";
  }

  async authenticate(config: Config, options: Options) {
    const payload = new FormData();
    payload.append("email", options.email);

    const tokenRawResult = await fetch("http://mini.tailor.tech:18888/token", {
      method: "POST",
      body: payload,
    });
    const tokenResult = (await tokenRawResult.json()) as { id_token: string };
    const callbackPayload = new FormData();
    callbackPayload.append("id_token", tokenResult.id_token);
    callbackPayload.append("redirect_path", options.redirectPath);
    return {
      mode: "manual-callback" as const,
      payload: callbackPayload,
    };
  }

  callback(config: Config, params: URLSearchParams) {
    const idToken = params.get("id_token");
    const redirectURI = params.get("redirect_path");
    if (!idToken || !redirectURI) {
      throw paramsError();
    }

    const payload = new FormData();
    payload.append("id_token", idToken);
    return {
      payload,
      redirectUri: redirectURI,
    };
  }
}
