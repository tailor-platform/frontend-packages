import type { Meta, StoryObj } from "@storybook/react";

import { Box, Stack, StackProps } from "@tailor-platform/styled-system/jsx";

Stack.displayName = "Stack";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<StackProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack p={4} gap={4} bgColor="bg.subtle" {...args}>
      <Box>Item1</Box>
      <Box>Item2</Box>
    </Stack>
  ),
};
