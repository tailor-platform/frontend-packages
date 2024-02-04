import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  square,
  SquareProperties,
} from "@tailor-platform/styled-system/patterns";

export type SquareProps = HTMLStyledProps<"div"> & SquareProperties;

export const Square = (props: SquareProps) => {
  const { size, ...rest } = props;
  return <styled.div className={square({ size })} {...rest} />;
};

Square.displayName = "Square";
