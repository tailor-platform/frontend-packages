import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { radio } from "@tailor-platform/styled-system/recipes";
import { ReactNode } from "react";

type RadioContentProps = {
  children?: ReactNode | undefined;
  defaultChecked?: boolean;
};

export type RadioProps = RadioContentProps & HTMLStyledProps<"input">;

export const Radio = (props: RadioProps) => {
  const { children, defaultChecked, ...rest } = props;
  return (
    <styled.label data-part="root" data-scope="radio" className={radio()}>
      <styled.input
        type="radio"
        data-part="input"
        className="peer"
        data-scope="radio"
        {...rest}
      />
      <styled.div
        data-part="control"
        data-scope="radio"
        aria-checked={defaultChecked}
      />
      {children && (
        <styled.span data-part="label" data-scope="radio">
          {children}
        </styled.span>
      )}
    </styled.label>
  );
};

Radio.displayName = "Radio";
