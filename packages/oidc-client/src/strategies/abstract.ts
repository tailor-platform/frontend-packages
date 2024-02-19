import { Config } from "@lib/config";

export type AuthenticateTrigger =
  | {
      mode: "redirection";
      uri: string;
    }
  | {
      mode: "function-call";
      callback: () => void;
    };

export type AbstractStrategy<T = Record<string, unknown>> = {
  name(): string;
  authenticate(config: Config, args: T): AuthenticateTrigger;
  callback(config: Config, params: URLSearchParams): FormData;
};
