import { cva } from "@tailor-platform/styled-system/css";
import { styled } from "@tailor-platform/styled-system/jsx";

export const labelStyle = cva({
  base: {
    fontSize: "sm",
    fontWeight: "medium",
    opacity: "70%",
  },
});

const Label = styled("label", labelStyle);
Label.displayName = "label";

export { Label };
