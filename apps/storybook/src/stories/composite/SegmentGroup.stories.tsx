import { SegmentGroup, SegmentGroupProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { segmentGroup } from "@tailor-platform/styled-system/recipes";
import { segmentGroupTypes } from "../../ark-types";

SegmentGroup.displayName = "SegmentGroup";

const meta = {
  title: "Composite/Segment",
  component: SegmentGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...segmentGroupTypes },
} satisfies Meta<SegmentGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { id: "react", label: "React" },
  { id: "solid", label: "Solid" },
  { id: "svelte", label: "Svelte", disabled: true },
  { id: "vue", label: "Vue" },
];

const classes = segmentGroup();

export const Default: Story = {
  render: (props) => (
    <SegmentGroup.Root
      className={classes.root}
      defaultValue="react"
      orientation="horizontal"
      {...props}
    >
      {options.map((option) => (
        <SegmentGroup.Item
          className={classes.item}
          key={option.id}
          value={option.id}
          disabled={option.disabled}
        >
          <SegmentGroup.ItemControl />
          <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
        </SegmentGroup.Item>
      ))}
      <SegmentGroup.Indicator className={classes.indicator} />
    </SegmentGroup.Root>
  ),
};
