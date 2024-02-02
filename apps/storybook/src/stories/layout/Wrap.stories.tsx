import type { Meta, StoryObj } from "@storybook/react";

import { Box, Wrap, WrapProps } from "@tailor-platform/design-systems";

Wrap.displayName = "Wrap";
Box.displayName = "Box";

const meta = {
  title: "Layout/Wrap",
  component: Wrap,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<WrapProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box maxW={200}>
      <Wrap gap={4} p={4} {...args}>
        <Box bgColor="bg.subtle">Tailor 1</Box>
        <Box bgColor="bg.subtle">Tailor 2</Box>
        <Box bgColor="bg.subtle">Tailor 3</Box>
        <Box bgColor="bg.subtle">Tailor 4</Box>
        <Box bgColor="bg.subtle">Tailor 5</Box>
        <Box bgColor="bg.subtle">Tailor 6</Box>
      </Wrap>
    </Box>
  ),
};
