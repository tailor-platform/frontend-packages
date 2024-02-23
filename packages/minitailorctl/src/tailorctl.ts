import { execa } from "execa";

// Run tailorctl as an independent process with environment variables
// that are needed to bypass platform authorization on minitailor
export const runTailorctl = (args: readonly string[]) =>
  execa("tailorctl", args, {
    stdio: "inherit",
    env: {
      APP_HTTP_SCHEMA: "http",
      PLATFORM_URL: "http://mini.tailor.tech:18090",
      TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
    },
  });

// Commands specified here is always exuecuted as tailorctl proxy without a splitter
const specialProxyCommands = ["app", "auth", "config", "cue", "workspace"];

// Run tailorctl proxy mode if splitter ("--") is specified before arguments
// But some specific commands listed in `specialProxyCommands` are exception
export const extractProxyCommand = (argv: readonly string[]) => {
  const initialArgv = argv.slice(2);
  if (initialArgv.length > 0) {
    const firstCommand = initialArgv[0];
    if (firstCommand === "--") {
      return initialArgv.slice(1);
    } else if (specialProxyCommands.includes(firstCommand)) {
      return initialArgv;
    }
  }
};
