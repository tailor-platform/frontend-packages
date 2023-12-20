"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  DataGridMultilingualStory,
  DataGridMultilingualStoryProps,
} from "./DataGridMultilingualStory.tsx";

import dataGridMultilingualStorySource from "./DataGridMultilingualStory.tsx?raw";

const meta: Meta<DataGridMultilingualStoryProps> = {
  title: "DataGrid/ DataGrid With Multilingual Support",
  component: DataGridMultilingualStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableColumnFilters: { control: "boolean" },
    localization: {
      control: "radio",
      options: ["EN", "JA"],
    },
  },
};

export default meta;
type Story = StoryObj<DataGridMultilingualStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: true,
    localization: "JA",
  },
  render: (args) => <DataGridMultilingualStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridMultilingualStorySource,
      },
    },
  },
};
