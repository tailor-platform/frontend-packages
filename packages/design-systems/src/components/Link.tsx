import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  link,
  type LinkVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type LinkProps = HTMLStyledProps<"a"> & LinkVariantProps;

export const Link = (props: LinkProps) => {
  const { variant, ...rest } = props;
  return <styled.a className={link({ variant })} {...rest} />;
};

Link.displayName = "Link";
