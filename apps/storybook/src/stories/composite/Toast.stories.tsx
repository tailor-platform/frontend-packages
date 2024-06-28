import {
  Toast,
  Toaster,
  createToaster,
  type ToastRootProps,
} from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { XIcon } from "lucide-react";
import { Button } from "@tailor-platform/design-systems";
import { toast } from "@tailor-platform/styled-system/recipes";
import { toastTypes } from "../../ark-types";

const meta: Meta<ToastRootProps> = {
  title: "Composite/Toast",
  component: Toast.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...toastTypes },
};

export default meta;
type Story = StoryObj<typeof meta>;

const classes = toast();

const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 24,
});

export const Default: Story = {
  render: () => {
    return (
      <>
        <Button
          variant="secondary"
          onClick={() =>
            toaster.create({
              title: "Toast Title",
              description: "Toast Description",
              type: "info",
            })
          }
        >
          Create Toast
        </Button>
        <Toaster toaster={toaster}>
          {(toast) => (
            <Toast.Root key={toast.id} className={classes.root}>
              <Toast.Title className={classes.title}>{toast.title}</Toast.Title>
              <Toast.Description className={classes.description}>
                {toast.description}
              </Toast.Description>
              <Toast.ActionTrigger>Do Action</Toast.ActionTrigger>
              <Toast.CloseTrigger className={classes.closeTrigger}>
                <XIcon />
              </Toast.CloseTrigger>
            </Toast.Root>
          )}
        </Toaster>
      </>
    );
  },
};
