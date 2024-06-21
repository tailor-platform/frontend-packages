import type { Meta, StoryObj } from "@storybook/react";
import { AppleIcon } from "lucide-react";
import { IconButton  } from "@tailor-platform/design-systems";
import { button } from "@tailor-platform/styled-system/recipes";
import React, { ReactElement } from "react";
import {
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  type ButtonVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type IconButtonProps = React.PropsWithChildren &
  HTMLStyledProps<"button"> &
  ButtonVariantProps & { icon?: ReactElement; "aria-label": string };

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
      ] as const,
      control: { type: "radio" },
    },
    size: {
      options: ["xs", "sm", "md", "lg", "xl", "2xl"] as const,
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
