import { styled } from "@tailor-platform/styled-system/jsx";
import { checkbox } from "@tailor-platform/styled-system/recipes";
import {
  CheckboxRoot as ArkCheckbox,
  CheckboxControl,
  CheckboxLabel,
  type CheckboxRootProps as ArkCheckboxProps,
} from "@ark-ui/react/checkbox";
import type { ReactNode } from "react";

export type CheckboxProps = ArkCheckboxProps & {
  children?: ReactNode;
};

export const Checkbox = (props: CheckboxProps) => (
  <ArkCheckbox className={checkbox()} {...props}>
    {(state) => (
      <>
        <CheckboxControl>
          {state.isChecked && <CheckIcon />}
          {state.isIndeterminate && <MinusIcon />}
        </CheckboxControl>
        {props.children && (
          <CheckboxLabel>
            <styled.span fontWeight="medium">{props.children}</styled.span>
          </CheckboxLabel>
        )}
      </>
    )}
  </ArkCheckbox>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.91675 7H11.0834"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Checkbox.displayName = "Checkbox";
