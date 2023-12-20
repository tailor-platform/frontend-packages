import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { appBar } from "@tailor-platform/styled-system/recipes";

export type AppBarProps = HTMLStyledProps<"div"> & {
  children?: React.ReactNode;
};

export const AppBar = (props: AppBarProps) => {
  const { children } = props;
  const classes = appBar();
  return <styled.div className={classes.root}>{children}</styled.div>;
};

AppBar.displayName = "AppBar";
