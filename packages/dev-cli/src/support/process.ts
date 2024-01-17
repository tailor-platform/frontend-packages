import { spawn } from "child_process";
import { homedir } from "os";
import path from "path";
import { logger } from "./logger.js";

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
    const executable = pathResolver();
    logger.debug(
      path.basename(executable),
      JSON.stringify({
        cmd: args.join(" "),
        envs: options?.env ?? {},
        path: executable,
      }),
    );

    const process = spawn(executable, args, {
      cwd: options?.workindDirectory,
      env: options?.env,
    });
    let errors: string[] = [];

    const handleUnknownError = (e: unknown) => {
      if (e instanceof Error) {
        reject(new SpawnProcessError(-1, [e.message]));
      } else {
        throw e;
      }
    };

    process.stdout.on("data", (value) => {
      try {
        cb?.onStdoutReceived && cb.onStdoutReceived(value.toString().trim());
      } catch (e: unknown) {
        handleUnknownError(e);
      }
    });

    process.stderr.on("data", (value) => {
      try {
        const msg = value.toString().trim();
        cb?.onStderrReceived && cb.onStderrReceived(msg);
        errors.push(msg);
      } catch (e: unknown) {
        handleUnknownError(e);
      }
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
