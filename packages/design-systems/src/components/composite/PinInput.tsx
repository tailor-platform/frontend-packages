import {
  PinInput as ArkPinInput,
  type PinInputRootProps as ArkPinInputProps,
} from "@ark-ui/react";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import {
  pinInput,
  type PinInputVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { ChevronDown } from "lucide-react";
import { Text } from "../Text";

export type PinInputProps = PinInputVariantProps &
  ArkPinInputProps &
  HTMLStyledProps<"div">;

export const PinInput = (props: PinInputProps) => {
  const { ...rest } = props;

  const classes = pinInput();
  return (
    <ArkPinInput.Root
      placeholder="0"
      onValueComplete={(e) => alert(e.valueAsString)}
      className={classes.root}
      {...rest}
    >
      <ArkPinInput.Control className={classes.control}>
        {[0, 1, 2, 3].map((id, index) => (
          <ArkPinInput.Input
            key={id}
            index={index}
            className={classes.input}
          />
        ))}
      </ArkPinInput.Control>
    </ArkPinInput.Root>
  );
};

PinInput.displayName = "PinInput";
