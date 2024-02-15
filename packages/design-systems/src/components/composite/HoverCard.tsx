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
import { Button } from "../Button";
import { Text } from "../Text";
import { Stack } from "../patterns/Stack";

export type HoverCardProps = HTMLStyledProps<"div"> & {
  children?: React.ReactNode;
};

export const HoverCard = (props: HoverCardProps) => {
  const { children } = props;
  const classes = hoverCard();
  return (
    <ArkHoverCard.Root>
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
        <ArkHoverCard.Positioner className={classes}>
          <ArkHoverCard.Content>
            <ArkHoverCard.Arrow>
              <ArkHoverCard.ArrowTip />
            </ArkHoverCard.Arrow>
            <Stack gap="4">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="full"
              >
                <Avatar
                  fallback="TA"
                  alt="Tailor Avatar"
                  src="https://source.boringavatars.com/beam"
                />
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => alert("Follow")}
                >
                  Follow
                </Button>
              </Stack>
              <Stack gap="2">
                <Stack gap="1">
                  <Stack direction="row" gap="1">
                    <styled.span textStyle="sm" fontWeight="semibold">
                      tailor
                    </styled.span>
                    <styled.span textStyle="sm" color="fg.muted">
                      Tailor Inc
                    </styled.span>
                  </Stack>
                  <Text textStyle="sm">
                    Composable Headless ERP to build your tailor-made business
                    apps
                  </Text>
                </Stack>
                <Stack
                  direction="row"
                  gap="1"
                  alignItems="center"
                  color="fg.muted"
                >
                  <Text textStyle="xs">Tokyo, Japan</Text>
                </Stack>
              </Stack>
            </Stack>
          </ArkHoverCard.Content>
        </ArkHoverCard.Positioner>
      </Portal>
    </ArkHoverCard.Root>
  );
};

HoverCard.displayName = "HoverCard";
