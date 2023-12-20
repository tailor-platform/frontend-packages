import type { Meta, StoryObj } from "@storybook/react";

import { button } from "@tailor-platform/styled-system/recipes";
import { VStack } from "@tailor-platform/styled-system/jsx";
import { Button, ButtonProps } from "@tailor-platform/design-systems";

const meta = {
  title: "Standalone/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "primary",
        "secondary",
        "tertiary",
        "link",
      ] as ButtonProps["variant"],
      control: { type: "radio" },
    },
    size: {
      options: ["xs", "sm", "md", "lg", "xl", "2xl"] as ButtonProps["size"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: button.raw({
    variant: "primary",
    size: "md",
  }),
  render: (args) => <Button {...args}>Button</Button>,
};

export const Variants: Story = {
  render: () => (
    <VStack gap={10}>
      <Button variant="primary">Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="tertiary">Button</Button>
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap={10}>
      <Button size="2xl">Button</Button>
      <Button size="xl">Button</Button>
      <Button size="lg">Button</Button>
      <Button size="md">Button</Button>
      <Button size="sm">Button</Button>
      <Button size="xs">Button</Button>
    </VStack>
  ),
};
