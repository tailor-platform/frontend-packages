import {
  Dialog as ArkDialog,
  DialogProps as ArkDialogProps,
  Portal,
} from "@ark-ui/react";
import {
  dialog,
  DialogVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Stack } from "../patterns/Stack";
import { X as XIcon } from "lucide-react";

type DialogContentProps = {
  buttonText: string;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  confirmFunction: () => void;
};

export type DialogProps = ArkDialogProps &
  DialogVariantProps &
  DialogContentProps;

export const Dialog = (props: DialogProps) => {
  const {
    buttonText,
    title,
    description,
    cancelText = "cancel",
    confirmText = "confirm",
    confirmFunction,
    ...rest
  } = props;

  const classes = dialog();
  return (
    <ArkDialog.Root {...rest}>
      <ArkDialog.Trigger asChild>
        <Button variant="secondary">{buttonText}</Button>
      </ArkDialog.Trigger>
      <Portal>
        <ArkDialog.Backdrop className={classes.backdrop} />
        <ArkDialog.Positioner className={classes.positioner}>
          <ArkDialog.Content className={classes.content}>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <ArkDialog.Title className={classes.title}>
                  {title}
                </ArkDialog.Title>
                <ArkDialog.Description className={classes.description}>
                  {description}
                </ArkDialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <ArkDialog.CloseTrigger asChild>
                  <Button variant="secondary" width="full">
                    {cancelText}
                  </Button>
                </ArkDialog.CloseTrigger>
                <Button onClick={() => confirmFunction()} width="full">
                  {confirmText}
                </Button>
              </Stack>
            </Stack>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            <ArkDialog.CloseTrigger
              /* @ts-ignore */
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
