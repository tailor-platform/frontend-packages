import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  circle,
  CircleProperties,
} from "@tailor-platform/styled-system/patterns";

export type CircleProps = HTMLStyledProps<"div"> & CircleProperties;

export const Circle = (props: CircleProps) => {
  const { size, ...rest } = props;
  return <styled.div className={circle({ size })} {...rest} />;
};

Circle.displayName = "Circle";
