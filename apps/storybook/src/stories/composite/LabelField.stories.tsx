import type { Meta, StoryObj } from "@storybook/react";
import { LabelField, LabelFieldProps } from "@tailor-platform/design-systems";

const meta: Meta<LabelFieldProps> = {
  title: "Standalone/LabelField",
  component: LabelField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    withBg: {
      control: { type: "boolean" },
    },
    hasBadge: {
      control: { type: "boolean" },
    },
    labelValue: {
      control: "text",
    },
    value: {
      control: "text",
    },
    href: {
      control: "text",
    },
    badgeValue: {
      control: "text",
    },
  },
} satisfies Meta<LabelFieldProps>;

export default meta;
type Story = StoryObj<LabelFieldProps>;

export const Default: Story = {
  args: {
    withBg: false,
    hasBadge: true,
    labelValue: "Label",
    value: "Value",
    href: "",
  },
  render: (args) => <LabelField {...args}></LabelField>,
};
