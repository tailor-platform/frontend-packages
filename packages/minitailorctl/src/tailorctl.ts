import { execa } from "execa";

export const runTailorctl = (args: string[]) =>
  execa("tailorctl", args, {
    stdio: "inherit",
    env: {
      // Environment variables needed to bypass platform authorization on minitailor
      APP_HTTP_SCHEMA: "http",
      PLATFORM_URL: "http://mini.tailor.tech:18090",
      TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
    },
  });
