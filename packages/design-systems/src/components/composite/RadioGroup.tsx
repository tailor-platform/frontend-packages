import {
  RadioGroup as ArkRadioGroup,
  type RadioGroupRootProps as ArkRadioGroupProps,
} from "@ark-ui/react";
import {
  radioGroup,
  type RadioGroupVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type RadioGroupOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type RadioGroupProps = RadioGroupVariantProps &
  ArkRadioGroupProps & {
    options: RadioGroupOption[];
    defaultValue?: string;
    orientation?: "horizontal" | "vertical";
    onValueChange?: (details: { value: string }) => void;
  };

export const RadioGroup = (props: RadioGroupProps) => {
  const { options, defaultValue, orientation, onValueChange, ...rest } = props;

  const classes = radioGroup();
  return (
    <ArkRadioGroup.Root
      className={classes.root}
      defaultValue={defaultValue}
      orientation={orientation}
      onValueChange={(details) =>
        onValueChange && onValueChange({ value: details.value })
      }
      {...rest}
    >
      {options.map((option) => (
        <ArkRadioGroup.Item
          className={classes.item}
          key={"radio" + option.value}
          value={option.value}
          disabled={option.disabled}
        >
          <ArkRadioGroup.ItemControl className={classes.itemControl} />
          <ArkRadioGroup.ItemText className={classes.itemText}>
            {option.label}
          </ArkRadioGroup.ItemText>
        </ArkRadioGroup.Item>
      ))}
    </ArkRadioGroup.Root>
  );
};

RadioGroup.displayName = "RadioGroup";
