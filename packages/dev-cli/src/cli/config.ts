import { rcFile } from "rc-config-loader";
import { rcConfigResult } from "rc-config-loader/lib/types.js";
import { Command } from "./commands.js";

export type ConfigContent = {
  // Version to use (v1, v2 are supported)
  version: string;

  // The name for docker-compose project
  name: string;

  // Port number to bind with minitailor app on docker-compose
  port: number;

  // The directory path where contains the files specified by the following `target` array
  manifest: string;

  // File names to run cuelang on and apply
  target: string[];

  // User-defined commands
  custom: Record<string, Omit<Command, "options">>;
};

export type Config = rcConfigResult<ConfigContent>;

// TODO: use Zod to validate and brand the configuration value
export const getConfig = () => {
  const results = rcFile<ConfigContent>("tailordev");
  if (!results) {
    return null;
  }
  return results.config;
};

export const isV2 = (config: ConfigContent | null) => config?.version === "v2";