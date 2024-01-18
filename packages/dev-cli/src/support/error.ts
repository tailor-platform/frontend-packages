import { terminal } from "./logger.js";
import { SpawnProcessError } from "./process.js";

export const handleError = (name: string, e: unknown) => {
  if (e instanceof SpawnProcessError) {
    terminal.error(name, e.errors.join());
  } else if (e instanceof Object && "out" in e) {
    // This probably is Error object returned from docker-compose process
    console.error(e.out);
  } else if (e instanceof Error) {
    terminal.error(name, e.message);
  } else {
    console.error(e);
  }
};
