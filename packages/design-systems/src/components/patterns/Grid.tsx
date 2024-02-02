import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { grid, GridProperties } from "@tailor-platform/styled-system/patterns";

export type GridProps = HTMLStyledProps<"div"> & GridProperties;

export const Grid = (props: GridProps) => {
  const { gap, columnGap, rowGap, columns, minChildWidth, ...rest } = props;
  return (
    <styled.div
      className={grid({ gap, columnGap, rowGap, columns, minChildWidth })}
      {...rest}
    />
  );
};

Grid.displayName = "Grid";
