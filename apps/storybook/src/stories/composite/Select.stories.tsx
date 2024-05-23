import { Portal, Select } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Box } from "@tailor-platform/styled-system/jsx";
import { select } from "@tailor-platform/styled-system/recipes";
import { selectTypes } from "../../ark-types";

const meta = {
  title: "Composite/Select",
  component: Select.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...selectTypes },
} as Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

type Item = {
  label: string;
  value: string;
  disabled?: boolean;
};

const items: Item[] = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Svelte", value: "svelte", disabled: true },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Preact", value: "preact" },
];

const classes = select();

export const Default: Story = {
  render: () => {
    return (
      <Box w={400} position="relative">
        <Select.Root
          className={classes.root}
          positioning={{ sameWidth: true }}
          items={items}
        >
          <Select.Label className={classes.label}>Framework</Select.Label>
          <Select.Control>
            <Select.Trigger className={classes.trigger} disabled={false}>
              <Select.ValueText placeholder="Select a Framework" />
              <Select.Indicator>
                <ChevronsUpDownIcon />
              </Select.Indicator>
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content className={classes.content}>
                <Select.ItemGroup id="framework">
                  <Select.ItemGroupLabel
                    className={classes.itemGroupLabel}
                    htmlFor="framework"
                  >
                    Framework
                  </Select.ItemGroupLabel>
                  {items.map((item) => (
                    <Select.Item
                      className={classes.item}
                      key={item.value}
                      item={item}
                    >
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator className={classes.itemIndicator}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Box>
    );
  },
};
