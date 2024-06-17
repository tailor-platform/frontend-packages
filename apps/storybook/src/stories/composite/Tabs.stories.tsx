import { Tabs, type TabsRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { tabs } from "@tailor-platform/styled-system/recipes";
import { tabsTypes } from "../../ark-types";

Tabs.Indicator.displayName = "TabIndicator";
Tabs.List.displayName = "TabList";
Tabs.Trigger.displayName = "TabTrigger";
Tabs.Root.displayName = "Tabs";

const meta = {
  title: "Composite/Tabs",
  component: Tabs.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...tabsTypes },
} satisfies Meta<TabsRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = tabs();

export const Default: Story = {
  render: (props) => (
    <Tabs.Root className={classes.root} defaultValue="react" {...props}>
      <Tabs.List className={classes.list}>
        <Tabs.Trigger className={classes.trigger} value="react">
          React
        </Tabs.Trigger>
        <Tabs.Trigger className={classes.trigger} value="solid">
          Solid
        </Tabs.Trigger>
        <Tabs.Trigger className={classes.trigger} value="vue">
          Vue
        </Tabs.Trigger>
        <Tabs.Indicator className={classes.indicator} />
      </Tabs.List>
    </Tabs.Root>
  ),
};
