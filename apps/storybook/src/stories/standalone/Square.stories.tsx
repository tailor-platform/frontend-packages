import type { Meta, StoryObj } from "@storybook/react";

import { Square, SquareProps } from "@tailor-platform/design-systems";

Square.displayName = "Square";

const meta = {
  title: "Standalone/Square",
  component: Square,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<SquareProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Square size={40} p={4} bgColor="bg.subtle" {...args}>
      Hello Square
    </Square>
  ),
};
