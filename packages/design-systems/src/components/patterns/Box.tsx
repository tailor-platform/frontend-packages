import { forwardRef, PropsWithChildren } from "react";
import { css, cx } from "@tailor-platform/styled-system/css";
import { styled, type BoxProps } from "@tailor-platform/styled-system/jsx";
import { box } from "@tailor-platform/styled-system/patterns";

export { type BoxProps };

export const Box = forwardRef<HTMLDivElement, PropsWithChildren<BoxProps>>(
  (props: PropsWithChildren<BoxProps>, ref) => {
    const { children, ...rest } = props;
    const className = cx(box({}), css({ ...rest }));
    return (
      <styled.div ref={ref} className={className} {...rest}>
        {children}
      </styled.div>
    );
  },
);
Box.displayName = "Box";
