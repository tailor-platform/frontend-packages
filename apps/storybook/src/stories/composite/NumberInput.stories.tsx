import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  type NumberInputProps,
  NumberInputScrubber,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { numberInput } from "@tailor-platform/styled-system/recipes";

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
    return (
      <NumberInput
        min={-50}
        max={50}
        defaultValue="42"
        className={numberInput()}
      >
        <NumberInputScrubber />
        <NumberInputInput />
        <NumberInputControl>
          <NumberInputIncrementTrigger>
            <ChevronUp size={16} />
          </NumberInputIncrementTrigger>
          <NumberInputDecrementTrigger>
            <ChevronDown size={16} />
          </NumberInputDecrementTrigger>
        </NumberInputControl>
      </NumberInput>
    );
  },
};
