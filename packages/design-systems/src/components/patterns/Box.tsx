import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { box, BoxProperties } from "@tailor-platform/styled-system/patterns";

export type BoxProps = HTMLStyledProps<"div"> & BoxProperties;

export const Box = (props: BoxProps) => {
  return <styled.div className={box({})} {...props} />;
};

Box.displayName = "Box";
