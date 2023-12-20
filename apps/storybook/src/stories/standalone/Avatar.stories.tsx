import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarProps } from "@tailor-platform/design-systems";
import { avatar } from "@tailor-platform/styled-system/recipes";

import { avatarTypes } from "../../ark-types";

const meta = {
  title: "Standalone/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] as AvatarProps["size"],
      control: { type: "radio" },
    },
    ...avatarTypes,
  },
} satisfies Meta<AvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...avatar.raw({ size: "md" }),
    fallback: "TA",
    src: "https://source.boringavatars.com/beam",
    alt: "Tailor Avatar",
  },
  render: (args) => <Avatar {...args}></Avatar>,
};
