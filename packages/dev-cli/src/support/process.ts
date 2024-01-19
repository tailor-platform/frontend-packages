import { spawn } from "child_process";
import { homedir } from "os";
import path from "path";
import { terminal } from "./logger.js";
import { cwd } from "process";

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
    const spawnOptions = {
      cwd: options?.workindDirectory || cwd(),
      env: {
        ...options?.env,
        // tailorctl creates a .tailorctl directory at $HOME directory
        // so spawning process should explicitly set $HOME to process.env.HOME here.
        HOME: process.env.HOME,
      },
    };
    const spawnedProcess = spawn(executable, args, spawnOptions);

    terminal.debug(
      path.basename(executable),
      JSON.stringify({
        cmd: args.join(" "),
        envs: spawnOptions?.env,
        cwd: spawnOptions.cwd,
        path: executable,
      }),
    );

    spawnedProcess.stdout.on("data", (value) => {
      cb?.onStdoutReceived && cb.onStdoutReceived(value.toString().trim());
    });

    let errors: string[] = [];
    spawnedProcess.stderr.on("data", (value) => {
      const msg = value.toString().trim();
      cb?.onStderrReceived && cb.onStderrReceived(msg);
      errors.push(msg);
    });

    spawnedProcess.on("error", (err) => {
      reject(err);
    });

    spawnedProcess.on("exit", (code) => {
      cb?.onExited && cb.onExited(code);
      if (code === 0) {
        resolve(code);
      } else {
        reject(new SpawnProcessError(code, errors));
      }
    });
  });
};
