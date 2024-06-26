import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { SideBar, SideBarItem } from "./SideBar";

type Props = {
  defaultExpanded?: string[];
};

const SideBarComponent = ({ defaultExpanded }: Props) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded || []);
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
          isVisible: true,
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
};

describe("<SideBar />", () => {
  it("renders SideBar correctly", () => {
    render(<SideBarComponent />);
    expect(screen.getByText("ワークフロー管理")).toBeInTheDocument();
    expect(screen.getByText("受発注")).toBeInTheDocument();
  });

  it("if user click label, UI show children", async () => {
    render(<SideBarComponent />);
    expect(screen.getByText("ワークフロー管理")).toBeInTheDocument();
    expect(screen.getByText("受発注")).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByText("ワークフロー管理"));
    expect(screen.getByText("申請履歴")).toBeInTheDocument();
    expect(screen.queryByText("承認管理")).toBeNull();
  });

  it("if isVisible is false, element is not visible", async () => {
    render(<SideBarComponent />);
    expect(screen.getByText("ワークフロー管理")).toBeInTheDocument();
    expect(screen.getByText("受発注")).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByText("ワークフロー管理"));
    expect(screen.getByText("申請履歴")).toBeInTheDocument();
    expect(screen.queryByText("承認管理")).toBeNull();
  });
});
