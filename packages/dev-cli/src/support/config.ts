import { rcFile } from "rc-config-loader";
import { rcConfigResult } from "rc-config-loader/lib/types.js";

export type ConfigContent = {
  name: string;
  port: number;
  manifest: string;
  target: string[];
};

export type Config = rcConfigResult<ConfigContent>;

export const getConfig = () => {
  return rcFile<ConfigContent>("tailordev");
};
