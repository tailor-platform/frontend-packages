import { PropsWithChildren } from "react";
import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";

type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends HTMLStyledProps<HeadingType> {
  as?: HeadingType;
}

export const Heading = (props: PropsWithChildren<HeadingProps>) => {
  const Component = styled[props.as || "h2"];
  return <Component {...props} />;
};

Heading.displayName = "Heading";
