import type { Meta, StoryObj } from "@storybook/react";
import { AppleIcon } from "lucide-react";

import { IconButton, IconButtonProps } from "@tailor-platform/design-systems";
import { button } from "@tailor-platform/styled-system/recipes";

const meta = {
  title: "Standalone/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "primary",
        "secondary",
        "tertiary",
        "link",
      ] as IconButtonProps["variant"],
      control: { type: "radio" },
    },
    size: {
      options: ["xs", "sm", "md", "lg", "xl", "2xl"] as IconButtonProps["size"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<IconButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <AppleIcon />,
    ...button.raw({
      variant: "primary",
      size: "md",
    }),
    "aria-label": "Icon Button",
  },
  render: (args) => <IconButton {...args}>IconButton</IconButton>,
};
