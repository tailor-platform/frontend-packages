import type { Meta, StoryObj } from "@storybook/react";
import {
  NumberInput,
  type NumberInputProps,
} from "@tailor-platform/design-systems";

import { numberInputTypes } from "../../ark-types";

const meta = {
  title: "Composite/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...numberInputTypes },
} satisfies Meta<NumberInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return <NumberInput min={-50} max={50} defaultValue="43" />;
  },
};
