import { RadioGroup, type RadioGroupRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { radioGroup } from "@tailor-platform/styled-system/recipes";
import { radioGroupTypes } from "../../ark-types";

RadioGroup.Root.displayName = "RadioGroup";

const meta = {
  title: "Composite/RadioGroup",
  component: RadioGroup.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...radioGroupTypes },
} satisfies Meta<RadioGroupRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = radioGroup();

export const Default: Story = {
  render: (props) => {
    const options = [
      { id: "react", label: "React" },
      { id: "solid", label: "Solid" },
      { id: "svelte", label: "Svelte", disabled: true },
      { id: "vue", label: "Vue" },
    ];
    return (
      <RadioGroup.Root
        className={classes.root}
        defaultValue="react"
        orientation="vertical"
        {...props}
      >
        {options.map((option) => (
          <RadioGroup.Item
            className={classes.item}
            key={option.id}
            value={option.id}
            disabled={option.disabled}
          >
            <RadioGroup.ItemControl className={classes.itemControl} />
            <RadioGroup.ItemText className={classes.itemText}>
              {option.label}
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    );
  },
};
