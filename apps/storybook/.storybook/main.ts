import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname, join } from "path";
import { loadConfigFromFile, mergeConfig } from "vite";

type ConfigEnv = {
  command: "build" | "serve";
  mode: string;
  isSsrBuild?: boolean;
  isPreview?: boolean;
};

const configEnvBuild: ConfigEnv = {
  mode: "production",
  command: "build",
};

const config: StorybookConfig = {
  stories: [
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "'../src/**/*.mdx',",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
    "@chromatic-com/storybook",
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {},
  core: {},
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // propFilter: (prop) => true, // Enable it when you need to view all props from external libraries.
    },
  },
  async viteFinal(config) {
    const res = await loadConfigFromFile(
      configEnvBuild,
      path.resolve(__dirname, "../vite.config.ts"),
    );
    if (res) {
      const { config: userConfig } = res;
      return mergeConfig(config, {
        ...userConfig,
      });
    }

    return config;
  },
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
