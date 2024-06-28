import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  Button,
  Text,
  HoverCard,
  type HoverCardProps,
} from "@tailor-platform/design-systems";
import { Stack, styled } from "@tailor-platform/styled-system/jsx";
import { hoverCardTypes } from "../../ark-types";

const meta: Meta<HoverCardProps> = {
  title: "Composite/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...hoverCardTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

// If `args` property is defined in Default Story object, a code appearance at the storybook web page becomes uncontrollable (and unreadable).
// So we defeined `args` (Trigger) as an argument of `render` property.
export const Default: Story = {
  render: () => {
    const Trigger = (
      <a href="https://www.tailor.tech/" target="_blank" rel="noreferrer">
        <Avatar
          fallback="TA"
          alt="Tailor Avatar"
          src="https://source.boringavatars.com/beam"
        />
      </a>
    );

    return (
      <HoverCard trigger={Trigger}>
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
                Composable Headless ERP to build your tailor-made business apps
              </Text>
            </Stack>
            <Stack direction="row" gap="1" alignItems="center" color="fg.muted">
              <Text textStyle="xs">Tokyo, Japan</Text>
            </Stack>
          </Stack>
        </Stack>
      </HoverCard>
    );
  },
};
