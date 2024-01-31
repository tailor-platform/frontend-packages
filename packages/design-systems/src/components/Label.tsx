import { HStack, type HTMLStyledProps, styled } from "@tailor-platform/styled-system/jsx";
import { cx, css } from "@tailor-platform/styled-system/css";
import { label } from "@tailor-platform/styled-system/recipes";
import { Badge } from "./Badge";

type LabelVariantProps = {
  labelValue: string;
  withBg?: boolean;
  hasBadge?: boolean;
  badgeValue: string;
};

export type LabelProps = HTMLStyledProps<"div"> & LabelVariantProps;

export const Label = (props: LabelProps) => {
  const { withBg, hasBadge, labelValue, badgeValue } = props;

  return (
    <HStack
      aria-label={labelValue}
      className={withBg ? cx(label()) : css({ textStyle: "xs", fontWeight: "bold" })}
    >
      <styled.p>
        {labelValue}
      </styled.p >
      {hasBadge && <Badge>{badgeValue || "Label"}</Badge>}
    </HStack>
  )
};

Label.displayName = "Label";
