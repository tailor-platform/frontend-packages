import { createToaster, Toast, type ToastRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { XIcon } from "lucide-react";
import { Button, IconButton } from "@tailor-platform/design-systems";
import { toast } from "@tailor-platform/styled-system/recipes";
import { toastTypes } from "../../ark-types";

const meta = {
  title: "Composite/Toast",
  component: Toast.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...toastTypes },
} satisfies Meta<ToastRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = toast();

export const Default: Story = {
  render: () => {
    const [Toaster, toast] = createToaster({
      placement: "bottom-end",
      render: (toast) => (
        <Toast.Root className={classes.root}>
          <Toast.Title className={classes.title}>{toast.title}</Toast.Title>
          <Toast.Description className={classes.description}>
            {toast.description}
          </Toast.Description>
          <Toast.CloseTrigger asChild className={classes.closeTrigger}>
            <IconButton
              aria-label="close"
              size="sm"
              variant="link"
              icon={<XIcon />}
            />
          </Toast.CloseTrigger>
        </Toast.Root>
      ),
    });
    return (
      <>
        <Button
          variant="secondary"
          onClick={() =>
            toast.create({ title: "Title", description: "Description" })
          }
        >
          Create Toast
        </Button>
        <Toaster />
      </>
    );
  },
};
