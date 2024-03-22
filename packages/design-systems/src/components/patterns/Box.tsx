import { forwardRef } from "react";
import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { box, BoxProperties } from "@tailor-platform/styled-system/patterns";

export type BoxProps = HTMLStyledProps<"div"> & BoxProperties;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (props: BoxProps, ref) => {
    return <styled.div ref={ref} className={box({})} {...props} />;
  },
);
Box.displayName = "Box";
