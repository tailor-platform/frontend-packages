import {
  Accordion as ArkAccordion,
  type AccordionRootProps as ArkAccordionProps,
} from "@ark-ui/react/accordion";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import {
  accordion,
  type AccordionVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { ChevronDown } from "lucide-react";
import { Text } from "../Text";

export type AccordionItem = {
  text: string | React.ReactElement;
  content: React.ReactNode;
};

type AccordionContentProps = {
  items: AccordionItem[];
};

export type AccordionProps = AccordionVariantProps &
  ArkAccordionProps &
  AccordionContentProps &
  HTMLStyledProps<"div">;

export const Accordion = (props: AccordionProps) => {
  const { items, variant, ...rest } = props;

  const AccordionIcon = (props: { isOpen: boolean }) => {
    const iconStyles = {
      transform: props.isOpen ? "rotate(-180deg)" : undefined,
      transition: "transform 0.2s",
      transformOrigin: "center",
    };
    return <ChevronDown height={16} style={iconStyles} />;
  };

  const accordionClasses = accordion({ variant });
  return (
    <ArkAccordion.Root className={accordionClasses.root} {...rest}>
      {items.map((item, id) => {
        const isString = typeof item.text === "string";
        return (
          <ArkAccordion.Item
            className={accordionClasses.item}
            key={id}
            value={typeof item.text === "string" ? item.text : id.toString()}
          >
            {({ isOpen }) => (
              <>
                <ArkAccordion.ItemTrigger
                  className={accordionClasses.itemTrigger}
                >
                  {isString ? (
                    <Text w="full" textAlign="left">
                      {item.text}
                    </Text>
                  ) : (
                    item.text
                  )}
                  <AccordionIcon isOpen={isOpen} />
                </ArkAccordion.ItemTrigger>
                <ArkAccordion.ItemContent
                  className={accordionClasses.itemContent}
                >
                  {item.content}
                </ArkAccordion.ItemContent>
              </>
            )}
          </ArkAccordion.Item>
        );
      })}
    </ArkAccordion.Root>
  );
};

Accordion.displayName = "Accordion";
