// import { HoverCard, type HoverCardRootProps, Portal } from "@ark-ui/react";
// import { HoverCard, type HoverCardProps, Portal } from "@ark-ui/react";
import { Portal } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  Button,
  Text,
  HoverCard,
  type HoverCardRootProps,
} from "@tailor-platform/design-systems";
import { Stack, styled } from "@tailor-platform/styled-system/jsx";
import { hoverCard } from "@tailor-platform/styled-system/recipes";

import { hoverCardTypes } from "../../ark-types";
import { useState } from "react";

const meta = {
  title: "Composite/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...hoverCardTypes },
} satisfies Meta<HoverCardRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <a
          href="https://www.tailor.tech/"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            fallback="TA"
            alt="Tailor Avatar"
            src="https://source.boringavatars.com/beam"
          />
        </a>
        <HoverCard open={open}>
          <Stack gap="4">
            <Stack direction="row" justifyContent="space-between" width="full">
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
        </HoverCard>
      </>
    );
  },
};
