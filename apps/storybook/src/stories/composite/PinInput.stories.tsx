// import {
//   PinInputRoot,
//   PinInputControl,
//   PinInputInput,
//   type PinInputRootProps,
// } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { PinInput, type PinInputProps } from "@tailor-platform/design-systems";

import { css, cx } from "@tailor-platform/styled-system/css";
import { input, pinInput } from "@tailor-platform/styled-system/recipes";

import { pinInputTypes } from "../../ark-types";

// PinInputRoot.displayName = "PinInput";
// PinInputControl.displayName = "PinInputControl";
// PinInputInput.displayName = "PinInputInput";

const meta = {
  title: "Composite/PinInput",
  component: PinInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...pinInputTypes },
} satisfies Meta<PinInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <PinInput {...props}/>
    // <PinInputRoot
    //   placeholder="0"
    //   onValueComplete={(e) => alert(e.valueAsString)}
    //   className={pinInput()}
    //   {...props}
    // >
    //   <PinInputControl>
    //     {[0, 1, 2, 3].map((id, index) => (
    //       <PinInputInput
    //         key={id}
    //         index={index}
    //         className={cx(
    //           input({ size: "md", variant: "outline" }),
    //           css({ width: "12", textAlign: "center" }),
    //         )}
    //       />
    //     ))}
    //   </PinInputControl>
    // </PinInputRoot>
  ),
};
