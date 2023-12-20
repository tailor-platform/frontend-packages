import type { Meta, StoryObj } from "@storybook/react";
import { Code, CodeProps } from "@tailor-platform/design-systems/client";

const meta = {
  title: "Standalone/Code",
  component: Code,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["inline", "block"],
      control: { type: "radio" },
    },
    disableCopy: { type: "boolean" },
  },
} satisfies Meta<CodeProps>;

export default meta;

export const Default: StoryObj<CodeProps> = {
  args: {
    children: "const example = 'This is a code block';",
    variant: "block",
    disableCopy: false,
  },
  render: (args: CodeProps) => <Code {...args} />,
};

export const Block: StoryObj<CodeProps> = {
  args: {
    children: `export const Button = (props: ButtonProps) => {
      const { variant, size, leftIcon, rightIcon, children, ...rest } = props;

      return (
        <styled.button {...rest} className={button({ variant, size })}>
          <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
            {children}
          </ButtonContent>
        </styled.button>
      );
    };`,
    disableCopy: false,
  },
};

export const Inline: StoryObj<CodeProps> = {
  args: {
    children: "inline_code",
    variant: "inline",
  },
  parameters: {
    argTypes: {
      disableCopy: { table: { disable: true } },
    },
  },
};
