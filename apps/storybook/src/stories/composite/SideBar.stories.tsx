import type { Meta, StoryObj } from "@storybook/react";
import {
  SideBar,
  SideBarProps,
  SideBarItem,
} from "@tailor-platform/design-systems";
import { useState } from "react";

const meta: Meta<SideBarProps> = {
  title: "Composite/SideBar",
  component: SideBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const items: SideBarItem[] = [
      {
        id: "workflow",
        label: "ワークフロー管理",
        isOpen: expanded.includes("workflow"),
        children: [
          {
            id: "requestHistories",
            isVisible: true,
            link: <a href="#">申請履歴</a>,
          },
          {
            id: "requests",
            isVisible: false,
            link: <a href="#">承認管理</a>,
          },
        ],
      },
      {
        id: "orders",
        label: "受発注",
        isOpen: expanded.includes("orders"),
        children: [
          {
            id: "salesOrders-textile",
            isVisible: true,
            link: <a href="#">受注管理</a>,
          },
          {
            id: "purchaseOrders-textile",
            isVisible: false,
            link: <a href="#">発注管理</a>,
          },
        ],
      },
    ];

    return (
      <SideBar
        items={items}
        expandedValue={expanded}
        selectedValue={selected}
        onExpandedChange={(details) => {
          setExpanded(details.expandedValue);
        }}
        onSelectionChange={(details) => {
          setSelected(details.selectedValue);
        }}
      />
    );
  },
};
