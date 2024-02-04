import type { Meta, StoryObj } from "@storybook/react";

import { Bleed, BleedProps, Box } from "@tailor-platform/design-systems";

Bleed.displayName = "Bleed";
Box.displayName = "Box";

const meta = {
  title: "Layout/Bleed",
  component: Bleed,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<BleedProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box px={12} bgColor="red.200">
      <Bleed inline={6} bgColor="bg.subtle" {...args}>
        Hello Bleed
      </Bleed>
    </Box>
  ),
};
