import {
  type HTMLStyledProps,
  styled,
} from "@tailor-platform/styled-system/jsx";
import {
  button,
  type ButtonVariantProps,
} from "@tailor-platform/styled-system/recipes";
import {
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
} from "react";

type ButtonContentProps = {
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  href?: string;
};

export type ButtonProps = ButtonVariantProps &
  ButtonContentProps &
  React.PropsWithChildren &
  HTMLStyledProps<"button"> &
  HTMLStyledProps<"a">;

export const Button = (props: ButtonProps) => {
  const { variant, href, size, leftIcon, rightIcon, children, ...rest } = props;

  if (href) {
    return (
      <styled.a
        {...rest}
        className={button({ variant, size })}
        href={href}
        data-scope="button"
        data-part="root"
      >
        <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
          {children}
        </ButtonContent>
      </styled.a>
    );
  }

  return (
    <styled.button
      {...rest}
      className={button({ variant, size })}
      data-scope="button"
      data-part="root"
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </styled.button>
  );
};

const ButtonContent = (props: PropsWithChildren<ButtonContentProps>) => {
  const { leftIcon, rightIcon, children } = props;
  return (
    <>
      {leftIcon && <ButtonIcon mr="var(--icon-spacing)">{leftIcon}</ButtonIcon>}
      {children}
      {rightIcon && (
        <ButtonIcon ml="var(--icon-spacing)">{rightIcon}</ButtonIcon>
      )}
    </>
  );
};

type ButtonIconProps = React.PropsWithChildren & HTMLStyledProps<"span">;

const ButtonIcon = (props: ButtonIconProps) => {
  const { children, ...rest } = props;

  return (
    <styled.span data-scope="button" data-part="icon" {...rest}>
      {isValidElement(children)
        ? cloneElement(children, {
            // @ts-expect-error typings are wrong
            "aria-hidden": true,
            focusable: false,
          })
        : children}
    </styled.span>
  );
};

Button.displayName = "Button";
