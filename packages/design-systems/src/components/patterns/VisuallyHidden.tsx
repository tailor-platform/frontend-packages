import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  visuallyHidden,
  VisuallyHiddenProperties,
} from "@tailor-platform/styled-system/patterns";

export type VisuallyHiddenProps = HTMLStyledProps<"div"> &
  VisuallyHiddenProperties;

export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  return <styled.div className={visuallyHidden({})} {...props} />;
};

VisuallyHidden.displayName = "VisuallyHidden";
