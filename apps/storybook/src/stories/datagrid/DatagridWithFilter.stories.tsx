"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  DataGridWithFilterStory,
  DataGridWithFilterStoryProps,
} from "./DataGridWithFilterStory.tsx";
import dataGridWithFilterStorySource from "./DataGridWithFilterStory.tsx?raw";
import { DataGridOnModalWithFilterStory } from "./DataGridOnModalWithFilterStory.tsx";
import dataGridOnModalWithFilterStorySource from "./DataGridOnModalWithFilterStory.tsx?raw";

const meta: Meta<DataGridWithFilterStoryProps> = {
  title: "DataGrid/ DataGrid With Filter",
  component: DataGridWithFilterStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableColumnFilters: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<DataGridWithFilterStoryProps>;

export const Default: Story = {
  args: {
    enableColumnFilters: true,
  },
  render: (args) => <DataGridWithFilterStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridWithFilterStorySource,
      },
    },
  },
};

export const OnModal: Story = {
  args: {
    enableColumnFilters: true,
  },
  render: (args) => <DataGridOnModalWithFilterStory {...args} />,
  parameters: {
    docs: {
      canvas: {
        sourceState: "hidden",
      },
      source: {
        code: dataGridOnModalWithFilterStorySource,
      },
    },
  },
};
