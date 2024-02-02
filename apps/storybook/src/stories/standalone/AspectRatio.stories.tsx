import type { Meta, StoryObj } from "@storybook/react";

import {
  AspectRatio,
  AspectRatioProps,
  Box,
} from "@tailor-platform/design-systems";

AspectRatio.displayName = "AspectRatio";

const meta = {
  title: "Standalone/AspectRatio",
  component: AspectRatio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<AspectRatioProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AspectRatio p={4} bgColor="bg.subtle" w={200} ratio={3} {...args}>
      <Box p={4}>Item1</Box>
    </AspectRatio>
  ),
};
