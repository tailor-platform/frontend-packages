"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridManualSortingStory,
  DataGridManualSortingStoryProps,
} from "./DataGridManualSortingStory.tsx";
import dataGridManualSortingStorySource from "./DataGridManualSortingStory.tsx?raw";

const meta: Meta<DataGridManualSortingStoryProps> = {
  title: "Datagrid/Datagrid With Manual Sorting Support",
  component: DataGridManualSortingStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<DataGridManualSortingStoryProps>;

export const Default: Story = {
  args: {},
  render: (args) => <DataGridManualSortingStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridManualSortingStorySource,
      },
    },
  },
};
