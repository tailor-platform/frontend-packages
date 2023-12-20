import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, CheckboxProps } from "@tailor-platform/design-systems";

import { checkboxTypes } from "../../ark-types";

const meta = {
  title: "Standalone/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...checkboxTypes },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "check" },
  render: (args) => <Checkbox {...args} />,
};
