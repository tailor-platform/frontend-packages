import { v2 as compose } from "docker-compose";
import { getConfig } from "../support/config.js";
import { composePath } from "./resource.js";
import { cwd } from "node:process";
import { defaultProfileName } from "../templates/compose.yaml.js";
import { terminal } from "../support/logger.js";

type RunningCallbacks = {
  onRunning?: (msg: string) => void;
};

export type DockerCompose = {
  down: () => Promise<compose.IDockerComposeResult>;
  up: () => Promise<compose.IDockerComposeResult>;
  import: (
    path: string,
    host: string,
    callbacks: RunningCallbacks,
  ) => Promise<compose.IDockerComposeResult>;
  apply: (
    callbacks?: RunningCallbacks,
  ) => Promise<compose.IDockerComposeResult>;
};

const config = getConfig();
const buildComposeOptions = () => {
  return [
    ["--profile", defaultProfileName],
    ["--project-directory", cwd()],
    config?.name ? ["-p", config.name] : [],
  ].flatMap((p) => p);
};

export const cliDockerComposeAdapter: DockerCompose = {
  down: () => {
    const opts = {
      config: composePath,
      commandOptions: ["--volumes", "--remove-orphans"],
      composeOptions: buildComposeOptions(),
    };
    debugLog("down", opts);
    return compose.down(opts);
  },
  up: () => {
    const cmds = {
      config: composePath,
      commandOptions: ["--detach"],
      composeOptions: buildComposeOptions(),
    };
    debugLog("up", cmds);
    return compose.upAll(cmds);
  },
  import: (path, host, callbacks) => {
    return compose.exec(
      "minitailor",
      ["/root/app", "import", "-m", `/root/backend/${path}`, "-T", host],
      {
        config: composePath,
        composeOptions: buildComposeOptions(),
        callback: (chunk) => {
          callbacks?.onRunning && callbacks.onRunning(chunk.toString().trim());
        },
      },
    );
  },

  // NOTE: planning to deprecate this after V2 migration
  apply: (callbacks) =>
    compose.exec(
      "minitailor",
      ["/root/app", "apply", "-m", "/root/backend/generated"],
      {
        config: composePath,
        composeOptions: buildComposeOptions(),
        callback: (chunk) => {
          callbacks?.onRunning && callbacks.onRunning(chunk.toString().trim());
        },
      },
    ),
} as const;

const debugLog = (cmd: string, options: compose.IDockerComposeOptions) => {
  terminal.debug(
    "docker-compose",
    JSON.stringify({
      cmd,
      config: options.config,
      composeOptions: options.composeOptions?.join(" "),
      commandOptions: options.commandOptions?.join(" "),
    }),
  );
};
