import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@tailor-platform/styled-system/jsx";
import {
  DatePicker,
  type DatePickerProps,
} from "@tailor-platform/design-systems/client";
import { datePickerTypes } from "../../ark-types";
import { ComponentType } from "react";

const meta: Meta<DatePickerProps> = {
  title: "Composite/DatePicker",
  component: DatePicker as ComponentType<DatePickerProps>,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...datePickerTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

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
