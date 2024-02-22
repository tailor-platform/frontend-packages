"use client";

import type { Meta, StoryObj } from "@storybook/react";
import dataGridPinedColumnStorySource from "./DataGridPinedColumnStory.tsx?raw";
import {
  DataGridPinedColumnStory,
  DataGridPinedColumnStoryProps,
} from "./DataGridPinedColumnStory.tsx";

const meta: Meta<DataGridPinedColumnStoryProps> = {
  title: "DataGrid/DataGrid With Pined Columns",
  component: DataGridPinedColumnStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableColumnFilters: { control: "boolean" },
    enableRowSelection: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<DataGridPinedColumnStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: false,
    enableRowSelection: true,
  },
  render: (args) => <DataGridPinedColumnStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridPinedColumnStorySource,
        hide: true,
      },
    },
  },
};
