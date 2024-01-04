import { v2 as compose } from "docker-compose";
import { getConfig } from "../support/config.js";
import { composePath } from "./resource.js";

export type DockerCompose = {
  down: () => Promise<compose.IDockerComposeResult>;
  upAll: () => Promise<compose.IDockerComposeResult>;
  apply: (callbacks?: {
    onRunning?: (msg: string) => void;
  }) => Promise<compose.IDockerComposeResult>;
};

const config = getConfig();
export const cliDockerComposeAdapter: DockerCompose = {
  down: () =>
    compose.down({
      config: composePath,
      commandOptions: ["--volumes", "--remove-orphans"],
      composeOptions: config?.config.name ? ["-p", config.config.name] : [],
    }),
  upAll: () =>
    compose.upAll({
      config: composePath,
      commandOptions: ["--detach"],
      composeOptions: config?.config.name ? ["-p", config.config.name] : [],
    }),
  apply: (callbacks) =>
    compose.exec(
      "minitailor",
      ["/root/app", "apply", "-m", "/root/backend/generated"],
      {
        config: composePath,
        composeOptions: config?.config.name ? ["-p", config.config.name] : [],
        callback: (chunk) => {
          callbacks?.onRunning && callbacks.onRunning(chunk.toString().trim());
        },
      },
    ),
};
