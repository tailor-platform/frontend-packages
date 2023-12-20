import {
  TabIndicator,
  TabList,
  Tabs,
  type TabsProps,
  TabTrigger,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { tabs } from "@tailor-platform/styled-system/recipes";

import { tabsTypes } from "../../ark-types";

TabIndicator.displayName = "TabIndicator";
TabList.displayName = "TabList";
TabTrigger.displayName = "TabTrigger";
Tabs.displayName = "Tabs";

const meta = {
  title: "Composite/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...tabsTypes },
} satisfies Meta<TabsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <Tabs className={tabs({})} defaultValue="react" {...props}>
      <TabList>
        <TabTrigger value="react">React</TabTrigger>
        <TabTrigger value="solid">Solid</TabTrigger>
        <TabTrigger value="vue">Vue</TabTrigger>
        <TabIndicator />
      </TabList>
    </Tabs>
  ),
};
