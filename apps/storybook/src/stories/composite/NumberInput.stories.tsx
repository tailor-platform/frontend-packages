import { NumberInput, type NumberInputRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { numberInput } from "@tailor-platform/styled-system/recipes";

import { numberInputTypes } from "../../ark-types";

const meta = {
  title: "Composite/NumberInput",
  component: NumberInput.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...numberInputTypes },
} satisfies Meta<NumberInputRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = numberInput();

export const Default: Story = {
  render: () => {
    return (
      <NumberInput.Root
        min={-50}
        max={50}
        defaultValue="42"
        className={classes.root}
      >
        <NumberInput.Scrubber className={classes.scrubber} />
        <NumberInput.Input className={classes.input} />
        <NumberInput.Control className={classes.control}>
          <NumberInput.IncrementTrigger className={classes.incrementTrigger}>
            <ChevronUp size={16} />
          </NumberInput.IncrementTrigger>
          <NumberInput.DecrementTrigger className={classes.decrementTrigger}>
            <ChevronDown size={16} />
          </NumberInput.DecrementTrigger>
        </NumberInput.Control>
      </NumberInput.Root>
    );
  },
};
