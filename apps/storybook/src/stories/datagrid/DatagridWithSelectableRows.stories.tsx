"use client";

import type { Meta, StoryObj } from "@storybook/react";
import dataGridStorySource from "./DataGridWithSelectableRowsStory.tsx?raw";
import {
  DataGridWithSelectableRowsStory,
  DataGridWithSelectableRowsStoryProps,
} from "./DataGridWithSelectableRowsStory.tsx";

const meta: Meta<DataGridWithSelectableRowsStoryProps> = {
  title: "DataGrid/DataGrid With Selectable Rows",
  component: DataGridWithSelectableRowsStory,
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
type Story = StoryObj<DataGridWithSelectableRowsStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: false,
    enableRowSelection: true,
  },
  render: (args) => <DataGridWithSelectableRowsStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridStorySource,
        hide: true,
      },
    },
  },
};
