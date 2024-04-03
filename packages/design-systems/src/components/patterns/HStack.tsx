import { PropsWithChildren } from "react";
import { css, cx } from "@tailor-platform/styled-system/css";
import { styled, type HstackProps } from "@tailor-platform/styled-system/jsx";
import { hstack } from "@tailor-platform/styled-system/patterns";

export { type HstackProps };

export const HStack = (props: PropsWithChildren<HstackProps>) => {
  const { justify, gap, children, ...rest } = props;
  const className = cx(hstack({ justify, gap }), css({ ...rest }));
  return <styled.div className={className}>{children}</styled.div>;
};

HStack.displayName = "HStack";
