"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  DataGridExportStory,
  DataGridExportStoryProps,
} from "./DataGridExportStory.tsx";
import dataGridExportStorySource from "./DataGridExportStory.tsx?raw";

const meta: Meta<DataGridExportStoryProps> = {
  title: "DataGrid/ DataGrid With Export",
  component: DataGridExportStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableColumnFilters: { control: "boolean" },
    enableCsvExport: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<DataGridExportStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: true,
    enableCsvExport: true,
  },
  render: (args) => <DataGridExportStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridExportStorySource,
      },
    },
  },
};
