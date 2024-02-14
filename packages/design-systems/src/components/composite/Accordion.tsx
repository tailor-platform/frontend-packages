import {
  Accordion as ArkAccordion,
  type AccordionProps as ArkAccordionProps,
} from "@ark-ui/react";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import { accordion } from "@tailor-platform/styled-system/recipes";
import { ChevronDown } from "lucide-react";
import { Button, ButtonProps } from "../Button";
import { Text } from "../Text";

export type AccordionItem = {
  text: string;
  content: React.ReactNode;
};

export type AccordionProps = HTMLStyledProps<"div"> &
  ArkAccordionProps &
  ButtonProps & {
    items: AccordionItem[];
  };

export const Accordion = (props: AccordionProps) => {
  const { items, variant = "tertiary", size, ...rest } = props;

  const AccordionIcon = (props: { isOpen: boolean }) => {
    const iconStyles = {
      transform: props.isOpen ? "rotate(-180deg)" : undefined,
      transition: "transform 0.2s",
      transformOrigin: "center",
    };
    return <ChevronDown height={16} style={iconStyles} />;
  };

  const accordionClasses = accordion();
  return (
    <ArkAccordion.Root className={accordionClasses.root} {...rest}>
      {items.map((item, id) => (
        <ArkAccordion.Item
          className={accordionClasses.item}
          key={id}
          value={item.text}
        >
          {({ isOpen }) => (
            <>
              <ArkAccordion.ItemTrigger
                className={accordionClasses.itemTrigger}
                asChild
              >
                <Button w="full" variant={variant} size={size} {...rest}>
                  <Text w="full" textAlign="left">
                    {item.text}?
                  </Text>
                  <AccordionIcon isOpen={isOpen} />
                </Button>
              </ArkAccordion.ItemTrigger>
              <ArkAccordion.ItemContent
                className={accordionClasses.itemContent}
              >
                {item.content}
              </ArkAccordion.ItemContent>
            </>
          )}
        </ArkAccordion.Item>
      ))}
    </ArkAccordion.Root>
  );
};

Accordion.displayName = "Accordion";
