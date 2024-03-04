import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  type PaginationProps,
} from "@tailor-platform/design-systems";
import { paginationTypes } from "../../ark-types";

Pagination.displayName = "Pagination";

const meta = {
  title: "Composite/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...paginationTypes },
} satisfies Meta<PaginationProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 5000,
    pageSize: 10,
    siblingCount: 2,
    children: null,
  },
  render: (args) => <Pagination {...args} />,
};
