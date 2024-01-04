import { Cuelang } from "../interfaces/cuelang.js";
import { Deptools } from "../interfaces/deptools.js";
import { DockerCompose } from "../interfaces/docker.js";
import { Resource } from "../interfaces/resource.js";
import { Tailorctl } from "../interfaces/tailorctl.js";
import { Config } from "./config.js";

export type UsecaseDeps = {
  resource: Resource;
  deptools: Deptools;
  dockerCompose: DockerCompose;
  cuelang: Cuelang;
  tailorctl: Tailorctl;
};
type Usecase<A> = (
  deps: UsecaseDeps
) => (args: A, config: Config | undefined) => Promise<void>;

// Curried usecase builder to support pluggable adapters
export const buildUsecase =
  <A>(
    impl: (
      input: UsecaseDeps & {
        args: A;
        config: Config | undefined;
      }
    ) => Promise<void>
  ): Usecase<A> =>
  (deps: UsecaseDeps) =>
  (args: A, config: Config | undefined) =>
    impl({ args, config, ...deps });
