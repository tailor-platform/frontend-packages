import { rcFile } from "rc-config-loader";

export const getConfig = () => {
  return rcFile<{
    name: string;
    port: number;
    manifest: string;
    target: string[];
  }>("tailordev");
};
