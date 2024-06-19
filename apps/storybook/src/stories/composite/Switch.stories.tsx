import { Switch, type SwitchRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { switchRecipe } from "@tailor-platform/styled-system/recipes";
import { switchTypes } from "../../ark-types";

Switch.Root.displayName = "Switch";
Switch.Control.displayName = "SwitchControl";
Switch.Label.displayName = "SwitchLabel";
Switch.Thumb.displayName = "SwitchThumb";

const meta = {
  title: "Composite/Switch",
  component: Switch.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...switchTypes },
} satisfies Meta<SwitchRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = switchRecipe();

export const Default: Story = {
  render: (props) => (
    <Switch.Root className={classes.root} {...props}>
      <Switch.Control className={classes.control}>
        <Switch.Thumb className={classes.thumb} />
      </Switch.Control>
      <Switch.Label className={classes.label}>Label</Switch.Label>
    </Switch.Root>
  ),
};
