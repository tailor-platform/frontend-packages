"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  DataGridColumnHideShowStory,
  DataGridColumnHideShowProps,
} from "./DataGridColumnHideShowStory";
import dataGridColumnHideShowStorySource from "./DataGridColumnHideShowStory.tsx?raw";

const meta: Meta<DataGridColumnHideShowProps> = {
  title: "DataGrid/ DataGrid With Column hide and show Support",
  component: DataGridColumnHideShowStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableHiding: { control: "boolean" },
    localization: {
      control: "radio",
      options: ["EN", "JA"],
    },
  },
};

export default meta;
type Story = StoryObj<DataGridColumnHideShowProps>;

export const Default: Story = {
  args: {
    enableHiding: true,
    localization: "JA",
  },
  render: (args) => <DataGridColumnHideShowStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridColumnHideShowStorySource,
      },
    },
  },
};
