import {
  type HTMLStyledProps,
  styled,
} from "@tailor-platform/styled-system/jsx";

export const Text = (props: HTMLStyledProps<"p">) => {
  return <styled.p {...props} />;
};

Text.displayName = "Text";

export const Textarea = (props: HTMLStyledProps<"textarea">) => {
  return <styled.textarea {...props} />;
};

Text.displayName = "Text";
