import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@tailor-platform/styled-system/jsx";
import {
  DatePicker,
  type DatePickerProps,
} from "@tailor-platform/design-systems";

import { datePickerTypes } from "../../ark-types";

const meta = {
  title: "Composite/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...datePickerTypes },
} satisfies Meta<DatePickerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// const classes = datePicker();

export const Default: Story = {
  render: () => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <Flex h={400}>
        <DatePicker label="Picker" ref={inputRef} />
      </Flex>
    );
  },
};
