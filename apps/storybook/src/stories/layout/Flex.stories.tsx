import type { Meta, StoryObj } from "@storybook/react";

import { Box, Flex, FlexProps } from "@tailor-platform/design-systems";

Flex.displayName = "Flex";
Box.displayName = "Box";

const meta = {
  title: "Layout/Flex",
  component: Flex,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<FlexProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Flex
      alignItems="center"
      justifyContent="center"
      p={4}
      bgColor="bg.subtle"
      {...args}
    >
      <Box p={4}>Item1</Box>
      <Box p={4}>Item2</Box>
    </Flex>
  ),
};
