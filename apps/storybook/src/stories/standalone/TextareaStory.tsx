import { Stack, HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import { Label, Textarea } from "@tailor-platform/design-systems";

export const TextareaStory = (props: HTMLStyledProps<"textarea">) => {
  return (
    <Stack gap="1.5" width="lg">
      <Label htmlContent="description">Description</Label>
      <Textarea id="description" rows={4} {...props} />
    </Stack>
  );
};
