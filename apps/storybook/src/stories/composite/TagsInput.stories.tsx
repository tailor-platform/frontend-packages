import { TagsInput, type TagsInputProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { X as XIcon } from "lucide-react";

import { Button, IconButton } from "@tailor-platform/design-systems";
import { tagsInput } from "@tailor-platform/styled-system/recipes";
import { tagsInputTypes } from "../../ark-types";

TagsInput.displayName = "TagsInput";

const meta = {
  title: "Composite/TagInput",
  component: TagsInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...tagsInputTypes },
} satisfies Meta<TagsInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = tagsInput();

export const Default: Story = {
  args: { defaultValue: ["React", "Solid", "Vue"], children: null },
  render: (props) => (
    <TagsInput.Root
      className={classes.root}
      defaultValue={["React", "Solid", "Vue"]}
      {...props}
    >
      {(api) => (
        <>
          <TagsInput.Label className={classes.label}>
            Frameworks
          </TagsInput.Label>
          <TagsInput.Control className={classes.control}>
            {api.value.map((value, index) => (
              <TagsInput.Item
                className={classes.item}
                key={index}
                index={index}
                value={value}
              >
                <TagsInput.ItemText>{value}</TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger asChild>
                  <IconButton aria-label="close" variant="link" size="xs">
                    <XIcon />
                  </IconButton>
                </TagsInput.ItemDeleteTrigger>
                <TagsInput.ItemInput className={classes.itemInput} />
              </TagsInput.Item>
            ))}
            <TagsInput.Input
              className={classes.input}
              placeholder="Add Framework"
            />
          </TagsInput.Control>
          <TagsInput.ClearTrigger asChild>
            <Button variant="secondary">Clear</Button>
          </TagsInput.ClearTrigger>
        </>
      )}
    </TagsInput.Root>
  ),
};
