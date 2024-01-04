import { spawn } from "child_process";
import { homedir } from "os";
import path from "path";

export const destDir = path.join(homedir(), ".local", "share", "tailordev");
export const cuelangDir = path.join(destDir, "cuelang");
export const tailorctlDir = path.join(destDir, "tailorctl");

type PathResolver = () => string;
export const cuelangBinary: PathResolver = () => path.join(cuelangDir, "cue");
export const tailorctlBinary: PathResolver = () =>
  path.join(tailorctlDir, "tailorctl");

export type SpawnCallback = {
  onStdoutReceived?: (value: string) => void;
  onExited?: (value: number | null) => void;
};

// Promisified version of spawn
export const spawnExecutable = (
  pathResolver: PathResolver,
  args: string[] = [],
  cb?: SpawnCallback,
  options?: {
    workindDirectory?: string;
  },
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const path = pathResolver();
    const process = spawn(path, args, {
      cwd: options?.workindDirectory,
    });

    process.stdout.on("data", (value) => {
      cb?.onStdoutReceived && cb.onStdoutReceived(value.toString());
    });

    process.on("error", (err) => {
      reject(err);
    });

    process.on("exit", (code) => {
      cb?.onExited && cb.onExited(code);
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`command exited abnormally (code: ${code})`));
      }
    });
  });
};
