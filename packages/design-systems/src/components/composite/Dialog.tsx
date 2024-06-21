import { ReactNode } from "react";
import {
  Dialog as ArkDialog,
  DialogRootProps as ArkDialogProps,
} from "@ark-ui/react";
import { Portal } from "@ark-ui/react";
import {
  dialog,
  DialogVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { X as XIcon } from "lucide-react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Stack } from "../patterns/Stack";

type DialogContentProps = {
  buttonText: string;
  title?: string;
  description: ReactNode;
  cancelText?: string;
  confirmText?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: (control?: { close: () => void }) => void;
};

export type DialogProps = ArkDialogProps &
  DialogVariantProps &
  DialogContentProps;

export const Dialog = (props: DialogProps) => {
  const {
    buttonText,
    title,
    description,
    cancelText = "Cancel",
    confirmText = "Confirm",
    isOpen,
    setIsOpen,
    onConfirm,
    ...rest
  } = props;

  const classes = dialog();
  const close = () => setIsOpen(false);
  return (
    <ArkDialog.Root
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      {...rest}
    >
      <Portal>
        <ArkDialog.Backdrop className={classes.backdrop} />
        <ArkDialog.Positioner className={classes.positioner}>
          <ArkDialog.Content className={classes.content}>
            <Stack gap={8} p={6}>
              <Stack gap={1}>
                {title && (
                  <ArkDialog.Title className={classes.title}>
                    {title}
                  </ArkDialog.Title>
                )}
                <ArkDialog.Description className={classes.description}>
                  {description}
                </ArkDialog.Description>
              </Stack>
              <Stack gap={3} direction="row" width="full">
                <ArkDialog.CloseTrigger asChild>
                  <Button
                    onClick={() => close()}
                    variant="secondary"
                    width="full"
                  >
                    {cancelText}
                  </Button>
                </ArkDialog.CloseTrigger>
                <Button onClick={() => onConfirm({ close })} width="full">
                  {confirmText}
                </Button>
              </Stack>
            </Stack>
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
                onClick={() => close()}
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
