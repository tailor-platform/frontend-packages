"use client";
import { cx } from "@tailor-platform/styled-system/css";
import { labelField } from "@tailor-platform/styled-system/recipes";
import { Box, Stack } from "@tailor-platform/styled-system/jsx";
import { Text } from "./Text";
import { Link } from "./Link";
import { Label, LabelProps } from "./Label";

type LabelFieldDsProps = {
  value: string | number | null | undefined;
  color?: string;
  href?: string;
  labelValue: string;
};

export type LabelFieldProps = LabelFieldDsProps & LabelProps;

export const LabelField = (props: LabelFieldProps & LabelProps) => {
  const { value, color, href, labelValue, withBg, hasBadge, badgeValue } =
    props;

  return (
    <Stack gap={2}>
      <Label
        labelValue={labelValue}
        hasBadge={hasBadge}
        badgeValue={badgeValue}
        withBg={withBg}
      />
      <Box className={withBg ? cx(labelField()) : undefined}>
        {href ? (
          <Link
            textStyle="sm"
            href={href}
            color={color ?? "link.default"}
            textDecorationLine="underline"
          >
            {value}
          </Link>
        ) : (
          <Text textStyle="sm" color={color ?? "fg.default"}>
            {value}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

LabelField.displayName = "LabelField";
