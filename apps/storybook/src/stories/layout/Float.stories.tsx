import type { Meta, StoryObj } from "@storybook/react";
import { Box, Float, FloatProps } from "@tailor-platform/design-systems";

Float.displayName = "Float";
Box.displayName = "Box";

const meta = {
  title: "Layout/Float",
  component: Float,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<FloatProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box position="relative" w="100%" h={100} bgColor="bg.subtle">
      <Float placement="bottom-end" {...args}>
        <Box mr={12} mb={8}>
          Float
        </Box>
      </Float>
    </Box>
  ),
};
