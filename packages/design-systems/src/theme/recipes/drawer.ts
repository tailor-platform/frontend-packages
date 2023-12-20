import { dialogAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(dialogAnatomy.build());

export const drawer = defineRecipe({
  className: "drawer",
  description: "A drawer style",
  base: parts({
    backdrop: {
      backdropFilter: "blur(4px)",
      background: {
        base: "white.a10",
        _dark: "black.a10",
      },
      inset: "0",
      position: "fixed",
      zIndex: "overlay",
      _open: {
        animation: "backdrop-in",
      },
      _closed: {
        animation: "backdrop-out",
      },
    },
    positioner: {
      alignItems: "center",
      display: "flex",
      top: 0,
      bottom: 0,
      justifyContent: "center",
      position: "fixed",
      width: { base: "full", sm: "sm" },
      zIndex: "modal",
    },
    content: {
      background: "bg.default",
      boxShadow: "lg",
      display: "grid",
      divideY: "1px",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateAreas: `
        'header'
        'body'
        'footer'
      `,
      height: "full",
      width: "full",
      _hidden: {
        display: "none",
      },
    },
    title: {
      color: "fg.default",
      fontWeight: "semibold",
      textStyle: "xl",
    },
    description: {
      color: "fg.muted",
      textStyle: "sm",
    },
  }),
});
