import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  hstack,
  HstackProperties,
} from "@tailor-platform/styled-system/patterns";

export type HstackProps = HTMLStyledProps<"div"> & HstackProperties;

export const HStack = (props: HstackProps) => {
  const { justify, gap, ...rest } = props;
  return <styled.div className={hstack({ justify, gap })} {...rest} />;
};

HStack.displayName = "HStack";
