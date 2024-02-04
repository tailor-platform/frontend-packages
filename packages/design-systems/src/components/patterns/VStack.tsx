import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  vstack,
  VstackProperties,
} from "@tailor-platform/styled-system/patterns";

export type VstackProps = HTMLStyledProps<"div"> & VstackProperties;

export const VStack = (props: VstackProps) => {
  const { justify, gap, ...rest } = props;
  return <styled.div className={vstack({ justify, gap })} {...rest} />;
};

VStack.displayName = "VStack";
