import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioProps } from "@tailor-platform/design-systems";
import { radio } from "@tailor-platform/styled-system/recipes";

const meta: Meta<RadioProps> = {
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
  args: radio.raw({ defaultChecked: true }),
  render: (args) => <Radio {...args} />,
};
