import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  type AccordionProps,
} from "@tailor-platform/design-systems";

const meta = {
  title: "Composite/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<AccordionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        text: "What is React?",
        content: `Pudding donut gummies chupa chups oat cake marzipan biscuit
    tart. Dessert macaroon ice cream bonbon jelly. Jelly topping
    tiramisu halvah lollipop.`,
      },
      {
        text: "What is Solid?",
        content: `Pudding donut gummies chupa chups oat cake marzipan biscuit
    tart. Dessert macaroon ice cream bonbon jelly. Jelly topping
    tiramisu halvah lollipop.`,
      },
      {
        text: "What is Vue?",
        content: `Pudding donut gummies chupa chups oat cake marzipan biscuit
    tart. Dessert macaroon ice cream bonbon jelly. Jelly topping
    tiramisu halvah lollipop.`,
      },
    ],
    defaultValue: ["What is React?"],
    collapsible: true,
  },
};
