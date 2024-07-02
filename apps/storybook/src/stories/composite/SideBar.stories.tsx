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

const items = (expanded: string[]): SideBarItem[] => {
  return [
    {
      root: {
        id: "workflow",
        label: "ワークフロー管理",
        isOpen: expanded.includes("workflow"),
      },
      contents: [
        {
          id: "requestHistories",
          isVisible: true,
          link: <a href="#">申請履歴</a>,
        },
        {
          id: "requests",
          isVisible: true,
          link: <a href="#">承認管理</a>,
        },
      ],
    },
    {
      root: {
        id: "layouts",
        label: "割付管理",
        link: <a href="#">割付管理</a>,
        isVisible: true,
      },
    },
    {
      root: {
        id: "closedContracts",
        label: "成約管理",
        link: <a href="#">成約管理</a>,
        isVisible: true,
      },
    },
    {
      root: {
        id: "orders",
        label: "受発注",
        isOpen: expanded.includes("orders"),
      },
      contents: [
        {
          id: "salesOrders-textile",
          isVisible: false,
          link: <a href="#">受注管理</a>,
        },
        {
          id: "purchaseOrders-textile",
          isVisible: false,
          link: <a href="#">発注管理</a>,
        },
        {
          id: "priceAdjustments-textile",
          isVisible: false,
          link: <a href="#">帳簿訂正</a>,
        },
        {
          id: "salesOrders-chemical",
          isVisible: false,
          link: <a href="#">受注管理</a>,
        },
        {
          id: "orders-textile",
          label: "繊維",
          isOpen: expanded.includes("orders-textile"),
          isVisible: true,
          children: [
            {
              id: "salesOrders-textile",
              isVisible: true,
              link: <a href="#">受注管理</a>,
            },
            {
              id: "purchaseOrders-textile",
              isVisible: true,
              link: <a href="#">発注管理</a>,
            },
            {
              id: "priceAdjustments-textile",
              isVisible: true,
              link: <a href="#">帳簿訂正</a>,
            },
          ],
        },
      ],
    },
  ];
};

export const Default: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <SideBar
        items={items(expanded)}
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
