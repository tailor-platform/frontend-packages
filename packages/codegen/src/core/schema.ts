import { z } from "zod";

const fieldSchema = z.object({
  description: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  // Only 1-depth nested schema is supported now
  fields: z
    .record(
      z.object({
        description: z.string(),
        type: z.string(),
        required: z.boolean().optional(),
      }),
    )
    .optional(),
});
export const tableSchema = z.object({
  name: z.string(),
  description: z.string(),
  fields: z.record(fieldSchema),
});

export type TableSchema = z.infer<typeof tableSchema>;
export type TableFields = (
  | string
  | (string | { [x: string]: string[] })[]
  | { [x: string]: string[] }
  | { [x: string]: TableFields }
  | TableFields
)[];

export const tailordbSchema = z.object({
  kind: z.string(),
  version: z.string(),
  namespace: z.string(),
  types: z.array(tableSchema),
});
