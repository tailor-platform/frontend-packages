import { TreeView } from "@ark-ui/react";
import { ChevronDown } from "lucide-react";
import { Container } from "@components/patterns/Container";
import { treeView } from "@tailor-platform/styled-system/recipes";

type SideBarItemChild = {
  id: string;
  link: React.ReactNode;
  isVisible?: boolean;
};

export type SideBarItem = {
  id: string;
  label: string;
  isOpen: boolean;
  children: Array<SideBarItemChild>;
};

export type SideBarProps = {
  items: SideBarItem[];
  expandedValue: string[];
  selectedValue: string[];
  onExpandedChange: (details: { expandedValue: string[] }) => void;
  onSelectionChange: (details: { selectedValue: string[] }) => void;
};

const treeViewClasses = treeView();

export const SideBar = ({
  items,
  expandedValue,
  selectedValue,
  onExpandedChange,
  onSelectionChange,
}: SideBarProps) => {
  return (
    <Container
      backgroundColor="#11323b"
      paddingY={3}
      paddingX={3}
      w="280px"
      color="#fff"
      fontSize="14px"
    >
      <TreeView.Root
        className={treeViewClasses.root}
        expandedValue={expandedValue}
        onExpandedChange={onExpandedChange}
        selectedValue={selectedValue}
        onSelectionChange={onSelectionChange}
      >
        <TreeView.Tree className={treeViewClasses.tree}>
          {items.map((item, i) => {
            return (
              <TreeView.Branch value={item.id} key={i}>
                <TreeView.BranchControl
                  className={treeViewClasses.branchControl}
                >
                  <TreeView.BranchText className={treeViewClasses.branchText}>
                    {item.label}
                    <TreeView.BranchIndicator>
                      <ChevronDown
                        size={16}
                        color="white"
                        style={{
                          transform: item.isOpen
                            ? "rotate(-180deg)"
                            : undefined,
                          transition: "transform 0.2s",
                          transformOrigin: "center",
                        }}
                      />
                    </TreeView.BranchIndicator>
                  </TreeView.BranchText>
                </TreeView.BranchControl>
                {item.children.map((child, j) => {
                  if (!child.isVisible) {
                    return null;
                  }
                  return (
                    <TreeView.BranchContent
                      className={treeViewClasses.branchContent}
                      key={j}
                    >
                      <TreeView.Item
                        className={treeViewClasses.item}
                        key={j}
                        value={child.id}
                      >
                        <TreeView.ItemIndicator
                          className={treeViewClasses.itemIndicator}
                        />
                        <TreeView.ItemText className={treeViewClasses.itemText}>
                          {child.link}
                        </TreeView.ItemText>
                      </TreeView.Item>
                    </TreeView.BranchContent>
                  );
                })}
              </TreeView.Branch>
            );
          })}
        </TreeView.Tree>
      </TreeView.Root>
    </Container>
  );
};
