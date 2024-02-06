import { Accordion as ArkAccordion } from "@ark-ui/react";
import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import { accordion } from "@tailor-platform/styled-system/recipes";
import { ChevronDown } from "lucide-react";
import { Button } from "../Button";
import { Text } from "../Text";

export type AccordionItem = {
  text: string;
  content: string;
};

export type AccordionProps = HTMLStyledProps<"div"> & {
  items: AccordionItem[];
};

export const Accordion = (props: AccordionProps) => {
  const { items } = props;

  const AccordionIcon = (props: { isOpen: boolean }) => {
    const iconStyles = {
      transform: props.isOpen ? "rotate(-180deg)" : undefined,
      transition: "transform 0.2s",
      transformOrigin: "center",
    };
    return <ChevronDown height={16} style={iconStyles} />;
  };

  return (
    <ArkAccordion.Root defaultValue={["React"]} className={accordion()}>
      {items.map((item, id) => (
        <ArkAccordion.Item key={id} value={item.text}>
          {({ isOpen }) => (
            <>
              <ArkAccordion.ItemTrigger asChild>
                <Button w="full" variant="tertiary" p={0}>
                  <Text w="full" textAlign="left">
                    {item.text}?
                  </Text>
                  <AccordionIcon isOpen={isOpen} />
                </Button>
              </ArkAccordion.ItemTrigger>
              <ArkAccordion.ItemContent>
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
