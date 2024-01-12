import { v2 as compose } from "docker-compose";
import { getConfig } from "../support/config.js";
import { composePath } from "./resource.js";
import { cwd } from "node:process";

type RunningCallbacks = {
  onRunning?: (msg: string) => void;
};

export type DockerCompose = {
  down: () => Promise<compose.IDockerComposeResult>;
  upAll: () => Promise<compose.IDockerComposeResult>;
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
    ["--profile", "all"],
    ["--project-directory", cwd()],
    ["-f", composePath],
    config?.config.name ? ["-p", config.config.name] : [],
  ].flatMap((p) => p);
};

export const cliDockerComposeAdapter: DockerCompose = {
  down: () =>
    compose.down({
      config: composePath,
      commandOptions: ["--volumes", "--remove-orphans"],
      composeOptions: buildComposeOptions(),
    }),
  upAll: () =>
    compose.upAll({
      config: composePath,
      commandOptions: ["--detach"],
      composeOptions: buildComposeOptions(),
    }),
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
};
