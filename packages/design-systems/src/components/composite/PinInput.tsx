import {
  PinInput as ArkPinInput,
  type PinInputRootProps as ArkPinInputProps,
} from "@ark-ui/react";
import {
  pinInput,
  type PinInputVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type PinInputProps = PinInputVariantProps & ArkPinInputProps & {
  digits?: number
};

export const PinInput = (props: PinInputProps) => {
  const { placeholder = "0", digits = 4, ...rest } = props;

  const classes = pinInput();
  return (
    <ArkPinInput.Root
      placeholder={placeholder}
      className={classes.root}
      {...rest}
    >
      <ArkPinInput.Control className={classes.control}>
        {[...Array(digits)].map((id, index) => (
          <ArkPinInput.Input key={id} index={index} className={classes.input} />
        ))}
      </ArkPinInput.Control>
    </ArkPinInput.Root>
  );
};

PinInput.displayName = "PinInput";
