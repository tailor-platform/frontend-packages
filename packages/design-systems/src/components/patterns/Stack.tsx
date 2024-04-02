import { PropsWithChildren } from "react";
import { css, cx } from "@tailor-platform/styled-system/css";
import { styled, type StackProps } from "@tailor-platform/styled-system/jsx";
import { stack } from "@tailor-platform/styled-system/patterns";
export { type StackProps };

export const Stack = (props: PropsWithChildren<StackProps>) => {
  const { align, justify, direction, gap, children, ...rest } = props;
  const className = cx(
    stack({ align, justify, direction, gap }),
    css({ ...rest }), // => 'bg_red'
  );
  return (
    <styled.div className={className} {...rest}>
      {children}
    </styled.div>
  );
};

Stack.displayName = "Stack";
