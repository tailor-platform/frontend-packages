"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridSortingStory,
  DataGridSortingStoryProps,
} from "./DataGridSortingStory.tsx";
import dataGridSortingStorySource from "./DataGridSortingStory.tsx?raw";

const meta: Meta<DataGridSortingStoryProps> = {
  title: "Datagrid/Datagrid With Sorting Support",
  component: DataGridSortingStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<DataGridSortingStoryProps>;

export const Default: Story = {
  args: {
    pageSize: 20,
  },
  render: (args) => <DataGridSortingStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridSortingStorySource,
      },
    },
  },
};
