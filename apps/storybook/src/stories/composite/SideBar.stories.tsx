import type { Meta, StoryObj } from "@storybook/react";
import { SideBar, SideBarProps } from "@tailor-platform/design-systems";

const meta = {
  title: "Composite/SideBar",
  component: SideBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<SideBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "workflow",
        label: "ワークフロー管理",
        isOpen: false,
        children: [
          {
            id: "requestHistories",
            link: <a href="#">申請履歴</a>,
          },
          {
            id: "requests",
            link: <a href="#">承認管理</a>,
          },
        ],
      },
      {
        id: "orders",
        label: "受発注",
        isOpen: false,
        children: [
          {
            id: "salesOrders-textile",
            link: <a href="#">受注管理</a>,
          },
          {
            id: "purchaseOrders-textile",
            link: <a href="#">発注管理</a>,
          },
        ],
      },
    ],
    expandedValue: ["workflow", "orders"],
    selectedValue: ["workflow"],
    onExpandedChange: () => {},
    onSelectionChange: () => {},
  },
  render: (args) => {
    return <SideBar {...args} />;
  },
};
