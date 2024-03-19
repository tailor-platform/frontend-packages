"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridPaginationStory,
  DataGridPaginationStoryProps,
} from "./DataGridPaginationStory.tsx";
import dataGridPaginationStorySource from "./DataGridPaginationStory.tsx?raw";

const meta: Meta<DataGridPaginationStoryProps> = {
  title: "Datagrid/Pagination Datagrid",
  component: DataGridPaginationStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number"}
  },
};

export default meta;
type Story = StoryObj<DataGridPaginationStoryProps>;

export const Default: Story = {
  args: {
    pageSize: 5,    
  },
  render: (args) => <DataGridPaginationStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridPaginationStorySource,
      },
    },
  },
};
