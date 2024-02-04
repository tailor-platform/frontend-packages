import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { flex, FlexProperties } from "@tailor-platform/styled-system/patterns";

export type FlexProps = HTMLStyledProps<"div"> & FlexProperties;

export const Flex = (props: FlexProps) => {
  const { align, justify, direction, wrap, basis, grow, shrink, ...rest } =
    props;
  return (
    <styled.div
      className={flex({ align, justify, direction, wrap, basis, grow, shrink })}
      {...rest}
    />
  );
};

Flex.displayName = "Flex";
