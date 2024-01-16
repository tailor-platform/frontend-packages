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
  onStderrReceived?: (value: string) => void;
  onExited?: (value: number | null) => void;
};

export class SpawnProcessError extends Error {
  constructor(
    readonly code: number | null,
    readonly errors: string[],
  ) {
    super(`process exited abnormally (code: ${code})`);
    this.errors = errors;
  }
}

// Promisified version of spawn
export const spawnExecutable = (
  pathResolver: PathResolver,
  args: string[] = [],
  cb?: SpawnCallback,
  options?: {
    workindDirectory?: string;
    env?: NodeJS.ProcessEnv;
  },
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const path = pathResolver();
    const process = spawn(path, args, {
      cwd: options?.workindDirectory,
      env: options?.env,
    });
    let errors: string[] = [];

    process.stdout.on("data", (value) => {
      cb?.onStdoutReceived && cb.onStdoutReceived(value.toString());
    });

    process.stderr.on("data", (value) => {
      cb?.onStderrReceived && cb.onStderrReceived(value.toString());
      errors.push(value.toString());
    });

    process.on("error", (err) => {
      reject(err);
    });

    process.on("exit", (code) => {
      cb?.onExited && cb.onExited(code);
      if (code === 0) {
        resolve(code);
      } else {
        reject(new SpawnProcessError(code, errors));
      }
    });
  });
};
