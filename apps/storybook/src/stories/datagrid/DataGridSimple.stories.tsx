"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridSimpleStory,
  DataGridSimpleStoryProps,
} from "./DataGridSimpleStory.tsx";
import dataGridSimpleStorySource from "./DataGridSimpleStory.tsx?raw";

const meta: Meta<DataGridSimpleStoryProps> = {
  title: "Datagrid/Simple Datagrid",
  component: DataGridSimpleStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableColumnFilters: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<DataGridSimpleStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: false,
  },
  render: (args) => <DataGridSimpleStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridSimpleStorySource,
      },
    },
  },
};
