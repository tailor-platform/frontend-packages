import { rcFile } from "rc-config-loader";
import { rcConfigResult } from "rc-config-loader/lib/types.js";

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
};

export type Config = rcConfigResult<ConfigContent>;

export const getConfig = () => {
  try {
    const results = rcFile<ConfigContent>("tailordev");
    if (!results) {
      return null;
    }
    return results.config;
  } catch (e: unknown) {
    return null;
  }
};

export const isV2 = (config: ConfigContent) => config.version === "v2";
