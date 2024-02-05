import "../../../packages/design-systems/src/output.css";
import "../../../packages/datagrid/dist/index.css";

import type { Preview, StoryFn } from "@storybook/react";
import React from "react";

import { Box } from "@tailor-platform/design-systems";

import { ColorModeButton } from "./ColorModeButton";

const withColorMode = (StoryFn: StoryFn) => {
  return (
    <Box className="color-mode-wrapper">
      <Box className="color-mode-button">
        <ColorModeButton />
      </Box>
      <StoryFn />
    </Box>
  );
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      canvas: {
        sourceState: "shown",
      },
    },
    options: {
      storySort: {
        order: [
          "Getting Started",
          "Layout",
          "Standalone",
          "Composite",
          "Datagrid",
        ],
      },
    },
  },
  decorators: [withColorMode],
};

export default preview;
