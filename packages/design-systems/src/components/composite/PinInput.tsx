import {
  PinInput as ArkPinInput,
  type PinInputRootProps as ArkPinInputProps,
} from "@ark-ui/react";
import {
  pinInput,
  type PinInputVariantProps,
} from "@tailor-platform/styled-system/recipes";

export type PinInputProps = PinInputVariantProps &
  ArkPinInputProps & {
    digits?: number;
  };

export const PinInput = (props: PinInputProps) => {
  const { placeholder = "0", digits = 4, variant, size, ...rest } = props;

  const classes = pinInput({ variant, size });
  return (
    <ArkPinInput.Root
      placeholder={placeholder}
      className={classes.root}
      {...rest}
    >
      <ArkPinInput.Control className={classes.control}>
        {[...(Array(digits) as number[])].map((_, i) => (
          <ArkPinInput.Input key={i} index={i} className={classes.input} />
        ))}
      </ArkPinInput.Control>
    </ArkPinInput.Root>
  );
};

PinInput.displayName = "PinInput";
