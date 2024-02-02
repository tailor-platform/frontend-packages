import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  aspectRatio,
  AspectRatioProperties,
} from "@tailor-platform/styled-system/patterns";

export type AspectRatioProps = HTMLStyledProps<"div"> & AspectRatioProperties;

export const AspectRatio = (props: AspectRatioProps) => {
  const { ratio, ...rest } = props;
  return <styled.div className={aspectRatio({ ratio })} {...rest} />;
};

AspectRatio.displayName = "AspectRatio";
