import { Box, VStack } from "@tailor-platform/styled-system/jsx";
import { skeletonLoader } from "@tailor-platform/styled-system/recipes";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Composite/SkeletonLoader",
  component: Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} as Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box w={400} position="relative">
      <VStack my={2}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Box key={index} w="full" h={12} className={skeletonLoader()} />
        ))}
      </VStack>
    </Box>
  ),
};
