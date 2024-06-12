import type { Meta, StoryObj } from "@storybook/react";
import { Center, CenterProps } from "@tailor-platform/design-systems";

Center.displayName = "Center";

const meta = {
  title: "Layout/Center",
  component: Center,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<CenterProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Center w="100%" p={4} bgColor="bg.subtle" {...args}>
      Hello Center
    </Center>
  ),
};
