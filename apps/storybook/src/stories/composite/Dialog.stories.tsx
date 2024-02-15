import type { Meta, StoryObj } from "@storybook/react";

import { Dialog, DialogProps } from "@tailor-platform/design-systems";
import { dialogTypes } from "../../ark-types";

const meta = {
  title: "Composite/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...dialogTypes },
} satisfies Meta<DialogProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <Dialog
      {...props}
      buttonText="Open Dialog"
      title="title"
      description="Dialog Description"
      confirmFunction={() => console.log("confirm")}
    />
  ),
};
