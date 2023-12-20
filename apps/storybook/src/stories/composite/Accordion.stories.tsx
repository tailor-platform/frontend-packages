import { Accordion, type AccordionProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown } from "lucide-react";

import { Button, Text } from "@tailor-platform/design-systems";
import { accordion } from "@tailor-platform/styled-system/recipes";

import { accordionTypes } from "../../ark-types";

const meta = {
  title: "Composite/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...accordionTypes },
} satisfies Meta<AccordionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const items = ["React", "Solid", "Vue"];

    const AccordionIcon = (props: { isOpen: boolean }) => {
      const iconStyles = {
        transform: props.isOpen ? "rotate(-180deg)" : undefined,
        transition: "transform 0.2s",
        transformOrigin: "center",
      };
      return <ChevronDown height={16} style={iconStyles} />;
    };

    return (
      <Accordion.Root defaultValue={["React"]} className={accordion()}>
        {items.map((item, id) => (
          <Accordion.Item key={id} value={item}>
            {({ isOpen }) => (
              <>
                <Accordion.ItemTrigger asChild>
                  <Button w="full" variant="tertiary" p={0}>
                    <Text w="full" textAlign="left">
                      What is {item}?
                    </Text>
                    <AccordionIcon isOpen={isOpen} />
                  </Button>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  Pudding donut gummies chupa chups oat cake marzipan biscuit
                  tart. Dessert macaroon ice cream bonbon jelly. Jelly topping
                  tiramisu halvah lollipop.
                </Accordion.ItemContent>
              </>
            )}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    );
  },
};
