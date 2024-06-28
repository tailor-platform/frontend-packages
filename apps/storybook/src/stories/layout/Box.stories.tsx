import type { Meta, StoryObj } from "@storybook/react";
import { Box, BoxProps } from "@tailor-platform/design-systems";
import { ComponentType } from "react";

Box.displayName = "Box";

const meta = {
  title: "Layout/Box",
  component: Box as ComponentType<BoxProps> | undefined,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<BoxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box p={4} bgColor="bg.subtle" {...args}>
      Hello Box
    </Box>
  ),
};
