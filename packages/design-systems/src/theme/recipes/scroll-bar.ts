import { defineRecipe } from "@pandacss/dev";

export const scrollBar = defineRecipe({
  className: "scrollBar",
  description: "A scroll Bar styles",
  base: {
    _webkitScrollbar: {
      w: "4",
      h: "322px",
      border: "1px 0 1px 1px",
      _hover: {
        bg: "red-500",
      },
    },
    _webkitScrollbarThumb: {
      w: "2",
      borderRadius: "lg",
    },
  },
});
