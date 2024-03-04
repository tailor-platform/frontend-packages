import type { Meta, StoryObj } from "@storybook/react";
import { PinInput, type PinInputProps } from "@tailor-platform/design-systems";
import { pinInputTypes } from "../../ark-types";

const meta = {
  title: "Composite/PinInput",
  component: PinInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...pinInputTypes },
} satisfies Meta<PinInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <PinInput digits={4} onValueComplete={(e) => alert(e.valueAsString)} {...props} />
  ),
};
