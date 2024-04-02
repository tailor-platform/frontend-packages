import { PropsWithChildren } from "react";
import { css, cx } from "@tailor-platform/styled-system/css";
import {
  styled,
  type HTMLStyledProps,
  type HstackProps,
} from "@tailor-platform/styled-system/jsx";
export { type HstackProps };
import {
  hstack,
  HstackProperties,
} from "@tailor-platform/styled-system/patterns";

// export type HstackProps = HTMLStyledProps<"div"> & HstackProperties;

export const HStack = (props: PropsWithChildren<HstackProps>) => {
  const { justify, gap, children, ...rest } = props;
  console.log("HStack props", rest);
  const className = cx(
    // returns the resolved class name: `button button--size-small`
    hstack({ justify, gap }),
    // add the override styles
    css({ ...rest }), // => 'bg_red'
  );
  console.log("HStack className", className);
  return <styled.div className={className}>{children}</styled.div>;
};

HStack.displayName = "HStack";
