import type { Meta, StoryObj } from "@storybook/react";

import { Divider, DividerProps } from "@tailor-platform/design-systems";
import { css } from "@tailor-platform/styled-system/css";

const meta = {
  title: "Standalone/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<DividerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className={css({ w: "400px" })}>
      <Divider {...args} />
    </div>
  ),
};
