import { AbstractStrategy, paramsError } from "@core/strategies/abstract";
import { Config } from "@core/config";
import { callbackByStrategy } from "@core/path";

type Options = {
  email: string;
  redirectPath: string;
};

export class MinitailorStrategy implements AbstractStrategy<Options> {
  name() {
    return "minitailor";
  }

  async authenticate(config: Config, options: Options) {
    const tokenRawResult = await fetch("http://mini.tailor.tech:18888/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: options.email,
      }),
    });
    const tokenResult = (await tokenRawResult.json()) as { id_token: string };
    return {
      mode: "manual-callback" as const,
      payload: {
        id_token: tokenResult.id_token,
        redirect_path: options.redirectPath,
      },
    };
  }

  callback(config: Config, request: Request) {
    const params = new URL(request.url).searchParams;
    const idToken = params.get("id_token");
    const redirectURI = params.get("redirect_path");
    if (!idToken || !redirectURI) {
      throw paramsError();
    }

    const redirectUri = encodeURI(
      config.appUrl(callbackByStrategy(this.name())),
    );
    const payload = new FormData();
    payload.append("id_token", idToken);
    payload.append("redirect_uri", redirectUri);
    return {
      payload,
      redirectUri: redirectURI,
    };
  }
}
