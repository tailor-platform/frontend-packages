import {
  HoverCard as ArkHoverCard,
  type HoverCardRootProps as ArkHoverCardProps,
  Portal,
} from "@ark-ui/react";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import { hoverCard } from "@tailor-platform/styled-system/recipes";

export type HoverCardProps = HTMLStyledProps<"div"> &
  ArkHoverCardProps &
  React.PropsWithChildren & {
    trigger: React.ReactNode;
  };

export const HoverCard = (props: HoverCardProps) => {
  const { children, trigger, ...rest } = props;
  const classes = hoverCard();
  return (
    <ArkHoverCard.Root {...rest}>
      <ArkHoverCard.Trigger asChild>{trigger}</ArkHoverCard.Trigger>
      <Portal>
        <ArkHoverCard.Positioner className={classes.positioner}>
          <ArkHoverCard.Content className={classes.content}>
            <ArkHoverCard.Arrow className={classes.arrow}>
              <ArkHoverCard.ArrowTip className={classes.arrowTip} />
            </ArkHoverCard.Arrow>
            {children}
          </ArkHoverCard.Content>
        </ArkHoverCard.Positioner>
      </Portal>
    </ArkHoverCard.Root>
  );
};

HoverCard.displayName = "HoverCard";
