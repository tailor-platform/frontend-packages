import {
  HoverCard as ArkHoverCard,
  type HoverCardProps as ArkHoverCardProps,
  Portal,
} from "@ark-ui/react";
import {
  styled,
  type HTMLStyledProps,
} from "@tailor-platform/styled-system/jsx";
import { hoverCard } from "@tailor-platform/styled-system/recipes";
import { Avatar } from "../Avatar";

export type HoverCardProps = HTMLStyledProps<"div"> &
  ArkHoverCardProps &
  React.PropsWithChildren;

export const HoverCard = (props: HoverCardProps) => {
  const { children, ...rest } = props;
  const classes = hoverCard();
  return (
    <ArkHoverCard.Root {...rest}>
      <ArkHoverCard.Trigger asChild>
        <a href="https://www.tailor.tech/" target="_blank" rel="noreferrer">
          <Avatar
            fallback="TA"
            alt="Tailor Avatar"
            src="https://source.boringavatars.com/beam"
          />
        </a>
      </ArkHoverCard.Trigger>
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
