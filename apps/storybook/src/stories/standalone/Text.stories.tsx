import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@tailor-platform/design-systems";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";

const meta = {
  title: "Standalone/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<HTMLStyledProps<"p">>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Text {...args}>The most customizable ERP platform</Text>,
};
