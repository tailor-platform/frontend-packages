import type { Meta, StoryObj } from "@storybook/react";

import { Grid, GridItem, GridProps } from "@tailor-platform/design-systems";

Grid.displayName = "Grid";
GridItem.displayName = "GridItem";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<GridProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Grid columns={3} gap={2} p={4} {...args}>
      <GridItem bgColor="bg.subtle" p={4}>
        Item1
      </GridItem>
      <GridItem bgColor="bg.subtle" p={4}>
        Item2
      </GridItem>
      <GridItem bgColor="bg.subtle" p={4}>
        Item3
      </GridItem>
      <GridItem bgColor="bg.subtle" p={4}>
        Item4
      </GridItem>
      <GridItem bgColor="bg.subtle" p={4}>
        Item5
      </GridItem>
      <GridItem bgColor="bg.subtle" p={4}>
        Item6
      </GridItem>
    </Grid>
  ),
};
