"use client";

import type { Meta, StoryObj } from "@storybook/react";

import {
  DataGridDensityStory,
  DataGridDensityStoryProps,
} from "./DataGridDensityStory.tsx";
import dataGridSimpleStorySource from "./DataGridDensityStory.tsx?raw";

const meta: Meta<DataGridDensityStoryProps> = {
  title: "Datagrid/ Datagrid witdh Density",
  component: DataGridDensityStory,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    enableDensity: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataGridDensityStoryProps>;

export const Default: Story = {
  args: {},
  render: (args) => <DataGridDensityStory {...args} />,
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
