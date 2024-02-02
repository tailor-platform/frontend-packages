import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  stack,
  StackProperties,
} from "@tailor-platform/styled-system/patterns";

export type StackProps = HTMLStyledProps<"div"> & StackProperties;

export const Stack = (props: StackProps) => {
  const { align, justify, direction, gap, ...rest } = props;
  return (
    <styled.div
      className={stack({ align, justify, direction, gap })}
      {...rest}
    />
  );
};

Stack.displayName = "Stack";
