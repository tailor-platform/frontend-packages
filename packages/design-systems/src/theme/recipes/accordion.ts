import { accordionAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(accordionAnatomy.build());

export const accordion = defineRecipe({
  className: "accordion",
  description: "An accordion style",
  base: parts({
    root: {
      width: "100%",
      background: "bg.surface",
      display: "flex",
      flexDirection: "column",
      divideY: "1px",
      p: 4,
    },
    itemTrigger: {
      alignItems: "center",
      background: "transparent",
      borderRadius: "lg",
      cursor: "pointer",
      color: "fg.defalut",
      display: "flex",
      fontWeight: "medium",
      justifyContent: "space-between",
      p: "0",
      pb: "2",
      textStyle: "md",
      width: "100%",
      "&:not([data-expanded])": {
        pb: "4",
      },
    },
    item: {
      borderColor: "fg.subtle",
      '&:not([hidden]) ~ :not([hidden]) > [data-part="trigger"]': {
        pt: "4",
      },
    },
    itemContent: {
      color: "fg.default",
      p: "4",
      textStyle: "sm",
    },
  }),
});
