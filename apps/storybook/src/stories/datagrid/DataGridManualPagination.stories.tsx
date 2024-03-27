"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridManualPaginationStory,
  DataGridManualPaginationStoryProps,
} from "./DataGridManualPaginationStory.tsx";
import dataGridManualPaginationStorySource from "./DataGridManualPaginationStory.tsx?raw";

const meta: Meta<DataGridManualPaginationStoryProps> = {
  title: "Datagrid/Datagrid With Manual Pagination Support",
  component: DataGridManualPaginationStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<DataGridManualPaginationStoryProps>;

export const Default: Story = {
  args: {},
  render: (args) => <DataGridManualPaginationStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridManualPaginationStorySource,
      },
    },
  },
};
