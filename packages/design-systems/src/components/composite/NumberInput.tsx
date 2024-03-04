import {
  NumberInput as ArkNumberInput,
  type NumberInputRootProps as ArkNumberInputProps,
} from "@ark-ui/react";
import {
  numberInput,
  type NumberInputVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { ChevronDown, ChevronUp } from "lucide-react";

export type NumberInputProps = NumberInputVariantProps & ArkNumberInputProps;

export const NumberInput = (props: NumberInputProps) => {
  const classes = numberInput();
  return (
    <ArkNumberInput.Root className={classes.root} {...props}>
      <ArkNumberInput.Scrubber className={classes.scrubber} />
      <ArkNumberInput.Input className={classes.input} />
      <ArkNumberInput.Control className={classes.control}>
        <ArkNumberInput.IncrementTrigger className={classes.incrementTrigger}>
          <ChevronUp size={16} />
        </ArkNumberInput.IncrementTrigger>
        <ArkNumberInput.DecrementTrigger className={classes.decrementTrigger}>
          <ChevronDown size={16} />
        </ArkNumberInput.DecrementTrigger>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  );
};

NumberInput.displayName = "NumberInput";
