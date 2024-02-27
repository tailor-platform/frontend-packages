import { Tooltip, type TooltipRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@tailor-platform/design-systems";
import { Box, styled } from "@tailor-platform/styled-system/jsx";
import { tooltip } from "@tailor-platform/styled-system/recipes";

import { toastTypes } from "../../ark-types";

Tooltip.Arrow.displayName = "TooltipArrow";
Tooltip.ArrowTip.displayName = "TooltipArrowTip";
Tooltip.Content.displayName = "TooltipContent";
Tooltip.Positioner.displayName = "TooltipPositioner";
Tooltip.Trigger.displayName = "TooltipTrigger";

const meta = {
  title: "Composite/Tooltip",
  component: Tooltip.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...toastTypes },
} satisfies Meta<TooltipRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = tooltip();

export const Default: Story = {
  args: {},
  render: (props) => (
    <Box h={100}>
      <Tooltip.Root openDelay={0} closeDelay={200} {...props}>
        <Tooltip.Trigger className={classes.trigger} asChild>
          <styled.span textStyle="sm" fontWeight="medium">
            Hover me
          </styled.span>
        </Tooltip.Trigger>
        <Tooltip.Positioner className={classes.positioner}>
          <Tooltip.Arrow className={classes.arrow}>
            <Tooltip.ArrowTip className={classes.arrowTip} />
          </Tooltip.Arrow>
          <Tooltip.Content className={classes.content}>
            <Text>My Tooltip</Text>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </Box>
  ),
};
