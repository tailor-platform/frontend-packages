import type { Meta, StoryObj } from "@storybook/react";

import { Circle, CircleProps } from "@tailor-platform/styled-system/jsx";

Circle.displayName = "Circle";

const meta = {
  title: "Layout/Circle",
  component: Circle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<CircleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Circle p={4} bgColor="bg.subtle" {...args}>
      Hello Circle
    </Circle>
  ),
};
