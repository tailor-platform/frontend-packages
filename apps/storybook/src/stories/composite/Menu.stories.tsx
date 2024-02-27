import { Menu, type MenuRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { menuTypes } from "../../ark-types";
import { MenuStory } from "./MenuStory.tsx";
import menuStorySource from "./MenuStory.tsx?raw";

const meta = {
  title: "Composite/Menu",
  component: Menu.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...menuTypes },
} satisfies Meta<MenuRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <MenuStory />,
  parameters: {
    docs: {
      source: {
        code: menuStorySource,
      },
    },
  },
};
