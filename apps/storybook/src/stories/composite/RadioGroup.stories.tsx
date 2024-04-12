// import { RadioGroup, type RadioGroupRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RadioGroup,
  type RadioGroupProps,
  type RadioGroupOption,
} from "@tailor-platform/design-systems";
import { radioGroupTypes } from "../../ark-types";

const meta: Meta<RadioGroupProps> = {
  title: "Composite/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...radioGroupTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => {
    const options: RadioGroupOption[] = [
      { value: "react", label: "React" },
      { value: "solid", label: "Solid" },
      { value: "svelte", label: "Svelte", disabled: true },
      { value: "vue", label: "Vue" },
    ];
    return <RadioGroup {...props} options={options} defaultValue="react" />;
  },
};
