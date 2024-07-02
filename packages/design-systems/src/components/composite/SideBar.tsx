import { TreeView } from "@ark-ui/react";
import { Container } from "@components/patterns/Container";
import * as recipes from "@tailor-platform/styled-system/recipes";
import { ChevronDownIcon } from "lucide-react";

export type SideBarItem = {
  root: {
    id: string;
    label: string;
    isOpen?: boolean;
    link?: React.ReactNode;
    isVisible?: boolean;
  };
  contents?: Array<ContentItem>;
};

export type ContentItem = {
  id: string;
  label?: string;
  isOpen?: boolean;
  link?: React.ReactNode;
  isVisible?: boolean;
  children?: Array<ContentItem>;
};

export type SideBarProps = {
  items: SideBarItem[];
  expandedValue: string[];
  selectedValue: string[];
  onExpandedChange: (details: { expandedValue: string[] }) => void;
  onSelectionChange: (details: { selectedValue: string[] }) => void;
};

const treeViewClasses = recipes.treeView();

export const SideBar = ({
  items,
  expandedValue,
  selectedValue,
  onExpandedChange,
  onSelectionChange,
}: SideBarProps) => {
  const renderBranchContent = (content: ContentItem, index: number) => {
    if (!content.isVisible) {
      return null;
    }

    if (content.children) {
      return (
        <TreeView.Branch
          value={content.id}
          key={index}
          className={treeViewClasses.branch}
        >
          <TreeView.BranchControl className={treeViewClasses.branchControl}>
            <TreeView.BranchText className={treeViewClasses.branchText}>
              {content.label}
              <ChevronIndicator isOpen={content.isOpen} />
            </TreeView.BranchText>
          </TreeView.BranchControl>
          {content.children.map((subChild, subChildIndex) => {
            if (!subChild.isVisible) {
              return null;
            }
            <TreeView.BranchContent
              className={treeViewClasses.branchContent}
              key={subChildIndex}
            >
              <TreeView.Item
                className={treeViewClasses.item}
                key={subChildIndex}
                value={subChild.id}
              >
                <TreeView.ItemIndicator
                  className={treeViewClasses.itemIndicator}
                />
                <TreeView.ItemText className={treeViewClasses.itemText}>
                  {subChild.link}
                </TreeView.ItemText>
              </TreeView.Item>
            </TreeView.BranchContent>;
          })}
        </TreeView.Branch>
      );
    }

    return (
      <TreeView.Item
        className={treeViewClasses.item}
        key={index}
        value={content.id}
      >
        <TreeView.ItemIndicator className={treeViewClasses.itemIndicator} />
        <TreeView.ItemText className={treeViewClasses.itemText}>
          {content.link}
        </TreeView.ItemText>
      </TreeView.Item>
    );
  };

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
          {items.map((item, index) => (
            <TreeView.Branch value={item.root.id} key={index}>
              <TreeView.BranchControl className={treeViewClasses.branchControl}>
                <TreeView.BranchText className={treeViewClasses.branchText}>
                  {item.root.label}
                  {!item.root.link && (
                    <ChevronIndicator isOpen={item.root.isOpen} />
                  )}
                </TreeView.BranchText>
              </TreeView.BranchControl>
              <TreeView.BranchContent className={treeViewClasses.branchContent}>
                {item.contents?.map(renderBranchContent)}
              </TreeView.BranchContent>
            </TreeView.Branch>
          ))}
        </TreeView.Tree>
      </TreeView.Root>
    </Container>
  );
};

type ChevronIndicatorProps = {
  isOpen?: boolean;
};
const ChevronIndicator = ({ isOpen }: ChevronIndicatorProps) => (
  <TreeView.BranchIndicator>
    <ChevronDownIcon
      size={16}
      color="white"
      style={{
        transform: isOpen ? "rotate(-180deg)" : undefined,
        transition: "transform 0.2s",
        transformOrigin: "center",
      }}
    />
  </TreeView.BranchIndicator>
);
