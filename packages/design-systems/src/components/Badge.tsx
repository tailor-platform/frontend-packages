import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  badge,
  type BadgeVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type BadgeProps = HTMLStyledProps<"div"> & BadgeVariantProps;

export const Badge = (props: BadgeProps) => {
  const { variant, ...rest } = props;
  return <styled.div className={badge({ variant })} {...rest} />;
};

Badge.displayName = "Badge";
