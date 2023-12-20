import { Dialog, type DialogProps, Portal } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { X as XIcon } from "lucide-react";

import { Button, IconButton } from "@tailor-platform/design-systems";
import { Stack } from "@tailor-platform/styled-system/jsx";
import { dialog } from "@tailor-platform/styled-system/recipes";
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

const classes = dialog();

export const Default: Story = {
  render: (props) => (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild>
        <Button variant="secondary">Open dialog</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className={classes.backdrop} />
        <Dialog.Positioner className={classes.positioner}>
          <Dialog.Content className={classes.content}>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title className={classes.title}>
                  Dialog Title
                </Dialog.Title>
                <Dialog.Description className={classes.description}>
                  Dialog Description
                </Dialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <Dialog.CloseTrigger asChild>
                  <Button variant="secondary" width="full">
                    Cancel
                  </Button>
                </Dialog.CloseTrigger>
                <Button width="full">Confirm</Button>
              </Stack>
            </Stack>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Dialog.CloseTrigger position="absolute" top="2" right="2" asChild>
              <IconButton
                aria-label="Close Dialog"
                variant="tertiary"
                size="sm"
              >
                <XIcon />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  ),
};
