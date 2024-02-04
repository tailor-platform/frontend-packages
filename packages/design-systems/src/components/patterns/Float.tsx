import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  float,
  FloatProperties,
} from "@tailor-platform/styled-system/patterns";

export type FloatProps = HTMLStyledProps<"div"> & FloatProperties;

export const Float = (props: FloatProps) => {
  const { offsetX, offsetY, offset, placement, ...rest } = props;
  return (
    <styled.div
      className={float({ offsetX, offsetY, offset, placement })}
      {...rest}
    />
  );
};

Float.displayName = "Float";
