import { avatarAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(avatarAnatomy.build());

export const avatar = defineRecipe({
  className: "avatar",
  description: "An avatar style",
  base: parts({
    root: {
      borderRadius: "full",
    },
    fallback: {
      alignItems: "center",
      background: "bg.surface",
      color: "white",
      display: "flex",
      h: "inherit",
      w: "inherit",
      justifyContent: "center",
      textStyle: "md",
    },
    image: {
      objectFit: "cover",
    },
  }),
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      xs: parts({
        root: {
          h: "6",
          w: "6",
        },
      }),
      sm: parts({
        root: {
          h: "8",
          w: "8",
        },
      }),
      md: parts({
        root: {
          h: "10",
          w: "10",
        },
      }),
      lg: parts({
        root: {
          h: "12",
          w: "12",
        },
      }),
    },
  },
});
