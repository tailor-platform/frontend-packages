import { cloneElement, isValidElement, ReactElement } from "react";
import { css, cx } from "@tailor-platform/styled-system/css";
import {
  type HTMLStyledProps,
  styled,
} from "@tailor-platform/styled-system/jsx";
import {
  button,
  type ButtonVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type IconButtonProps = React.PropsWithChildren &
  HTMLStyledProps<"button"> &
  ButtonVariantProps & { icon?: ReactElement; "aria-label": string };

export const IconButton = (props: IconButtonProps) => {
  const { icon, variant, size, children, ...rest } = props;
  const element = icon || children;

  return (
    <styled.button
      className={cx(button({ variant, size }), css({ px: "0" }))}
      {...rest}
      data-scope="button"
      data-part="root"
    >
      {isValidElement(element)
        ? cloneElement(element, {
            // @ts-expect-error typings are wrong
            "aria-hidden": true,
            "data-scope": "button",
            "data-part": "icon",
            focusable: false,
          })
        : null}
    </styled.button>
  );
};

IconButton.displayName = "IconButton";
