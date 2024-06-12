import type { Meta, StoryObj } from "@storybook/react";
import { Box, HStack, HstackProps } from "@tailor-platform/design-systems";

HStack.displayName = "HStack";
Box.displayName = "Box";

const meta = {
  title: "Layout/HStack",
  component: HStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<HstackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <HStack p={4} gap={4} bgColor="bg.subtle" {...args}>
      <Box>Item1</Box>
      <Box>Item2</Box>
    </HStack>
  ),
};
