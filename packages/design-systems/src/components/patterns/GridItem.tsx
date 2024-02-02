import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  gridItem,
  GridItemProperties,
} from "@tailor-platform/styled-system/patterns";

export type GridItemProps = HTMLStyledProps<"div"> & GridItemProperties;

export const GridItem = (props: GridItemProps) => {
  const { colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, ...rest } =
    props;
  return (
    <styled.div
      className={gridItem({
        colSpan,
        rowSpan,
        colStart,
        rowStart,
        colEnd,
        rowEnd,
      })}
      {...rest}
    />
  );
};

GridItem.displayName = "GridItem";
