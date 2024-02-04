import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  center,
  CenterProperties,
} from "@tailor-platform/styled-system/patterns";

export type CenterProps = HTMLStyledProps<"div"> & CenterProperties;

export const Center = (props: CenterProps) => {
  const { inline, ...rest } = props;
  return <styled.div className={center({ inline })} {...rest} />;
};

Center.displayName = "Center";
