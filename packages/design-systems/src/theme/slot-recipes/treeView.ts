import { treeViewAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const treeView = defineSlotRecipe({
  className: "treeView",
  description: "A tree view style",
  slots: [...treeViewAnatomy.keys()],
  base: {
    tree: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    branch: {
      py: 2,
      px: 4,
    },
    branchControl: {
      py: 2,
      px: 4,
    },
    branchText: {
      display: "flex",
      justifyContent: "space-between",
      cursor: "pointer",
    },
    branchContent: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    item: {
      borderRadius: 4,
      "&[data-selected]": {
        background: "var(--colors-theme-fg-emphasized, #245A66)",
      },
      _hover: {
        background: "var(--colors-theme-fg-emphasized, #245A66)",
      },
    },
    itemText: {
      px: 8,
      py: 2,
      display: "block",
    },
  },
});
