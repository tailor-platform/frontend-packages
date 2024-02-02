import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import {
  container,
  ContainerProperties,
} from "@tailor-platform/styled-system/patterns";

export type ContainerProps = HTMLStyledProps<"div"> & ContainerProperties;

export const Container = (props: ContainerProps) => {
  return <styled.div className={container({})} {...props} />;
};

Container.displayName = "Container";
