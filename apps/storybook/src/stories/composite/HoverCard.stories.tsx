import { HoverCard, type HoverCardProps, Portal } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, Button, Text } from "@tailor-platform/design-systems";
import { Stack, styled } from "@tailor-platform/styled-system/jsx";
import { hoverCard } from "@tailor-platform/styled-system/recipes";

import { hoverCardTypes } from "../../ark-types";

const meta = {
  title: "Composite/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...hoverCardTypes },
} satisfies Meta<HoverCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a href="https://www.tailor.tech/" target="_blank" rel="noreferrer">
          <Avatar
            fallback="TA"
            alt="Tailor Avatar"
            src="https://source.boringavatars.com/beam"
          />
        </a>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner className={hoverCard()}>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
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
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  ),
};
