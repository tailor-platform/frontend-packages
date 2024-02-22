import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadConfigFromFile, mergeConfig } from "vite";

type ConfigEnv = {
  command: "build" | "serve";
  mode: string;
  isSsrBuild?: boolean;
  isPreview?: boolean;
};
const configEnvServe: ConfigEnv = {
  mode: "development",
  command: "serve",
};

const configEnvBuild: ConfigEnv = {
  mode: "production",
  command: "build",
};

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "'../src/**/*.mdx',",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-controls",
    "@storybook/addon-docs",
    "storybook-version",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // propFilter: (prop) => true, // Enable it when you need to view all props from external libraries.
    },
  },
  async viteFinal(config, { configType }) {
    const isProduction = configType === "PRODUCTION";
    const res = await loadConfigFromFile(
      isProduction ? configEnvBuild : configEnvServe,
      path.resolve(__dirname, "../vite.config.ts"),
    );
    if (res) {
      const { config: userConfig } = res;
      return mergeConfig(config, {
        ...userConfig,
        plugins: [tsconfigPaths()],
      });
    }

    return config;
  },
};
export default config;
