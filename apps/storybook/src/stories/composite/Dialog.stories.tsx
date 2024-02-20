import type { Meta, StoryObj } from "@storybook/react";

import { Button, Dialog, DialogProps } from "@tailor-platform/design-systems";
import { dialogTypes } from "../../ark-types";
import { useState } from "react";

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
  render: function Comp(props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          variant="secondary"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Open dialog
        </Button>
        <Dialog
          {...props}
          buttonText="Open Dialog"
          // title="title"
          description="Dialog Description"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onConfirm={(control) => {
            control?.close();
          }}
        />
      </>
    );
  },
};
