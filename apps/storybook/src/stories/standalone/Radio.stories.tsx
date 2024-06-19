import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioProps } from "@tailor-platform/design-systems";

const meta = {
  title: "Standalone/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<RadioProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultChecked: true },
  render: (args) => <Radio {...args} />,
};
