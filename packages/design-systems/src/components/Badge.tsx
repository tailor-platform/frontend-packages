import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { badge } from "@tailor-platform/styled-system/recipes";

export type BadgeProps = HTMLStyledProps<"div">;

export const Badge = (props: BadgeProps) => {
  return <styled.div className={badge()} {...props} />;
};

Badge.displayName = "Badge";
