import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { dividerStyle } from "@tailor-platform/styled-system/recipes";

export type DividerProps = HTMLStyledProps<"hr">;

export const Divider = (props: DividerProps) => {
  return <styled.hr className={dividerStyle()} {...props} />;
};

Divider.displayName = "Divider";
