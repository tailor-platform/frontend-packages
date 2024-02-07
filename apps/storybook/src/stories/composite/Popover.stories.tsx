import {
  Popover as PopoverArk,
  PopoverArrow,
  PopoverArrowTip,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverPositioner,
  type PopoverProps,
  PopoverTitle,
  PopoverTrigger,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button, Input } from "@tailor-platform/design-systems";
import { Box, Stack } from "@tailor-platform/styled-system/jsx";
import { popover } from "@tailor-platform/styled-system/recipes";

import { popoverTypes } from "../../ark-types";

type WithDisplayName<T> = T & { displayName?: string };
const Popover: WithDisplayName<typeof PopoverArk> = PopoverArk;

Popover.displayName = "Popover";
PopoverArrow.displayName = "PopoverArrow";
PopoverArrowTip.displayName = "PopoverArrowTip";
PopoverCloseTrigger.displayName = "PopoverCloseTrigger";
PopoverContent.displayName = "PopoverContent";
PopoverDescription.displayName = "PopoverDescription";
PopoverPositioner.displayName = "PopoverPositioner";
PopoverTitle.displayName = "PopoverTitle";
PopoverTrigger.displayName = "PopoverTrigger";

const meta = {
  title: "Composite/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...popoverTypes },
} satisfies Meta<PopoverProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <Box minH={300}>
      <Popover {...props}>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="md">
            Open
          </Button>
        </PopoverTrigger>
        <PopoverPositioner className={popover()}>
          <PopoverContent>
            <PopoverArrow>
              <PopoverArrowTip />
            </PopoverArrow>
            <Stack gap="4">
              <Stack gap="1">
                <PopoverTitle>Favorite Cake</PopoverTitle>
                <PopoverDescription>
                  Dessert jelly beans pudding chocolate pie pastry danish
                  chocolate pie.
                </PopoverDescription>
              </Stack>
              <Input variant="outline" size="sm" />
              <Stack direction="row" gap="3">
                <PopoverCloseTrigger asChild>
                  <Button variant="link" size="sm">
                    Dismiss
                  </Button>
                </PopoverCloseTrigger>
                <Button variant="link" size="sm" color="primary.default">
                  Show
                </Button>
              </Stack>
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </Popover>
    </Box>
  ),
};
