import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { wrap, WrapProperties } from "@tailor-platform/styled-system/patterns";

export type WrapProps = HTMLStyledProps<"div"> & WrapProperties;

export const Wrap = (props: WrapProps) => {
  const { gap, rowGap, columnGap, align, justify, ...rest } = props;
  return (
    <styled.div
      className={wrap({ gap, rowGap, columnGap, align, justify })}
      {...rest}
    />
  );
};

Wrap.displayName = "Wrap";
