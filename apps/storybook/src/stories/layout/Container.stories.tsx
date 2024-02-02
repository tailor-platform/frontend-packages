import type { Meta, StoryObj } from "@storybook/react";

import { Container, ContainerProps } from "@tailor-platform/design-systems";

Container.displayName = "Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<ContainerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Container w="100%" p={4} bgColor="bg.subtle" {...args}>
      Hello Container
    </Container>
  ),
};
