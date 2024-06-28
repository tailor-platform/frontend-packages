import type { Meta, StoryObj } from "@storybook/react";
import { Input, InputProps } from "@tailor-platform/design-systems";
import { HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import {
  input,
  InputVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { ComponentType } from "react";

const meta: Meta<InputProps> = {
  title: "Standalone/Input",
  component: Input as
    | ComponentType<Omit<HTMLStyledProps<"input">, "size"> & InputVariantProps>
    | undefined,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg", "xl", "2xl"],
      control: { type: "radio" },
    },
  },
};

export default meta;

export const Default: StoryObj<InputProps> = {
  args: {
    ...input.raw({ size: "md" }),
  },
  render: (args) => <Input {...args} />,
};
