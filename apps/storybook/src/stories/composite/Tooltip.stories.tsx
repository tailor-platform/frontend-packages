import {
  Tooltip,
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  type TooltipProps,
  TooltipTrigger,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@tailor-platform/design-systems";
import { Box, styled } from "@tailor-platform/styled-system/jsx";
import { tooltip } from "@tailor-platform/styled-system/recipes";

import { toastTypes } from "../../ark-types";

TooltipArrow.displayName = "TooltipArrow";
TooltipArrowTip.displayName = "TooltipArrowTip";
TooltipContent.displayName = "TooltipContent";
TooltipPositioner.displayName = "TooltipPositioner";
TooltipTrigger.displayName = "TooltipTrigger";

const meta = {
  title: "Composite/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...toastTypes },
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (props) => (
    <Box h={100}>
      <Tooltip openDelay={0} closeDelay={200} {...props}>
        <TooltipTrigger asChild>
          <styled.span textStyle="sm" fontWeight="medium">
            Hover me
          </styled.span>
        </TooltipTrigger>
        <TooltipPositioner className={tooltip({})}>
          <TooltipArrow>
            <TooltipArrowTip />
          </TooltipArrow>
          <TooltipContent>
            <Text>My Tooltip</Text>
          </TooltipContent>
        </TooltipPositioner>
      </Tooltip>
    </Box>
  ),
};
