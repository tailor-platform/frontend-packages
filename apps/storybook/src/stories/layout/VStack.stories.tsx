import type { Meta, StoryObj } from "@storybook/react";
import { Box, VStack, VstackProps } from "@tailor-platform/design-systems";

VStack.displayName = "VStack";
Box.displayName = "Box";

const meta = {
  title: "Layout/VStack",
  component: VStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<VstackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <VStack p={4} gap={4} bgColor="bg.subtle" {...args}>
      <Box>Item1</Box>
      <Box>Item2</Box>
    </VStack>
  ),
};
