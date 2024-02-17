import { NextResponse } from "next/server";
import { RouteHandler } from "../middleware";
import { internalExchangeTokenForSession } from "@lib/core";
import { Session } from "@/lib/types";

export class CallbackError extends Error {
  constructor(
    readonly name: string,
    readonly message: string,
  ) {
    super(message);
  }
}

export const paramsError = () =>
  new CallbackError("invalid-params", "code and redirectURI should be filled");
export const exchangeError = (reason: string) =>
  new CallbackError("failed-exchange", reason);

export const callbackHandler: RouteHandler = async ({
  request,
  config,
  options,
}) => {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const redirectURI = params.get("redirect_uri");
  if (!code || !redirectURI) {
    throw paramsError();
  }

  const session = await internalExchangeTokenForSession(config, code);
  if ("error" in session) {
    throw exchangeError(session.error);
  }
  options?.prepend &&
    (await options.prepend({
      token: session.access_token,
      userID: session.user_id,
    }));

  const redirection = NextResponse.redirect(config.appUrl(redirectURI));
  redirection.cookies.set(
    buildCookieEntry(session, "tailor.token", "access_token"),
  );
  return redirection;
};

const buildCookieEntry = <const T extends keyof Session>(
  session: Session,
  name: string,
  value: T,
) => {
  // Use the strictest cookie here
  // Here does not manually set `expires` in cookies because token expiration is handled on Tailor Plaform side
  return {
    name,
    value: session[value],
    sameSite: "strict" as const,
    httpOnly: true,
    secure: true,
  };
};
