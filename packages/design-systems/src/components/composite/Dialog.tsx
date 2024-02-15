import {
  Dialog as ArkDialog,
  DialogProps as ArkDialogProps,
  Portal
} from "@ark-ui/react";
import {
  dialog,
  DialogVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Stack } from "../patterns/Stack";
import { X as XIcon } from "lucide-react";


export type DialogProps = ArkDialogProps & DialogVariantProps;

export const Dialog = (props: DialogProps) => {
  const classes = dialog();
  return (
    <ArkDialog.Root {...props}>
      <ArkDialog.Trigger asChild>
        <Button variant="secondary">Open dialog</Button>
      </ArkDialog.Trigger>
      <Portal>
        <ArkDialog.Backdrop className={classes.backdrop} />
        <ArkDialog.Positioner className={classes.positioner}>
          <ArkDialog.Content className={classes.content}>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <ArkDialog.Title className={classes.title}>
                  Dialog Title
                </ArkDialog.Title>
                <ArkDialog.Description className={classes.description}>
                  Dialog Description
                </ArkDialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <ArkDialog.CloseTrigger asChild>
                  <Button variant="secondary" width="full">
                    Cancel
                  </Button>
                </ArkDialog.CloseTrigger>
                <Button width="full">Confirm</Button>
              </Stack>
            </Stack>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <ArkDialog.CloseTrigger
              position="absolute"
              top="2"
              right="2"
              asChild
            >
              <IconButton
                aria-label="Close Dialog"
                variant="tertiary"
                size="sm"
              >
                <XIcon />
              </IconButton>
            </ArkDialog.CloseTrigger>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  );
};

Dialog.displayName = "Dialog";
