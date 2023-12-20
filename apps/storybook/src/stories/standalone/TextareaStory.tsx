import { Stack } from "@tailor-platform/styled-system/jsx";
import {
  Label,
  Textarea,
  type TextareaProps,
} from "@tailor-platform/design-systems";

export const TextareaStory = (props: TextareaProps) => {
  return (
    <Stack gap="1.5" width="lg">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" rows={4} {...props} />
    </Stack>
  );
};
