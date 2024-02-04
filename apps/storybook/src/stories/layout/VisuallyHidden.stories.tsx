import type { Meta, StoryObj } from "@storybook/react";

import {
  VisuallyHidden,
  VisuallyHiddenProps,
} from "@tailor-platform/design-systems";

VisuallyHidden.displayName = "VisuallyHidden";

const meta = {
  title: "Layout/VisuallyHidden",
  component: VisuallyHidden,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<VisuallyHiddenProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <VisuallyHidden p={4} bgColor="bg.subtle" {...args}>
      Hello VisuallyHidden
    </VisuallyHidden>
  ),
};
