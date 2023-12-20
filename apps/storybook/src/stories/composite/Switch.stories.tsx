import {
  Switch,
  SwitchControl,
  SwitchLabel,
  type SwitchProps,
  SwitchThumb,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { switchRecipe } from "@tailor-platform/styled-system/recipes";

import { switchTypes } from "../../ark-types";

Switch.displayName = "Switch";
SwitchControl.displayName = "SwitchControl";
SwitchLabel.displayName = "SwitchLabel";
SwitchThumb.displayName = "SwitchThumb";

const meta = {
  title: "Composite/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...switchTypes },
} satisfies Meta<SwitchProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Switch className={switchRecipe()}>
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Label</SwitchLabel>
    </Switch>
  ),
};
