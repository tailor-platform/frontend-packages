import { Cuelang } from "../interfaces/cuelang.js";
import { Deptools } from "../interfaces/deptools.js";
import { DockerCompose } from "../interfaces/docker.js";
import { Resource } from "../interfaces/resource.js";
import { Tailorctl } from "../interfaces/tailorctl.js";
import { getConfig } from "./config.js";

type Config = ReturnType<typeof getConfig>;

export type UsecaseDeps = {
  resource: Resource;
  deptools: Deptools;
  dockerCompose: DockerCompose;
  cuelang: Cuelang;
  tailorctl: Tailorctl;
};
type Usecase<A> = (
  deps: UsecaseDeps,
) => (args: A, config: Config) => Promise<void>;

// Curried usecase builder to support pluggable adapters
export const buildUsecase =
  <A>(
    impl: (
      input: UsecaseDeps & {
        args: A;
        config: Config;
      },
    ) => Promise<void>,
  ): Usecase<A> =>
  (deps: UsecaseDeps) =>
  (args: A, config: Config) =>
    impl({ args, config, ...deps });
