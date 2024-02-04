import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  bleed,
  BleedProperties,
} from "@tailor-platform/styled-system/patterns";

export type BleedProps = HTMLStyledProps<"div"> & BleedProperties;

export const Bleed = (props: BleedProps) => {
  const { inline, block, ...rest } = props;
  return <styled.div className={bleed({ inline, block })} {...rest} />;
};

Bleed.displayName = "Bleed";
