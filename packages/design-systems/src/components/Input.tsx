import { forwardRef } from "react";
import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  input,
  type InputVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type InputProps = Omit<HTMLStyledProps<"input">, "size"> &
  InputVariantProps;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { variant = "outline", size = "md", ...rest } = props;
  return (
    <styled.input ref={ref} className={input({ variant, size })} {...rest} />
  );
});

Input.displayName = "Input";
