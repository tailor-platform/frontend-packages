import { ForwardedRef, forwardRef } from "react";
import { scrollBar } from "@tailor-platform/styled-system/recipes";
import { Button } from "../../../Button";
import { Checkbox } from "../../../Checkbox";
import { Box } from "../../../patterns/Box";
import { Flex } from "../../../patterns/Flex";
import { HideShowProps } from "../types";

export const HideShow = forwardRef(
  <TData extends Record<string, unknown>>(
    props: HideShowProps<TData>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { allColumnsHandler, columns, localization, isVisible } = props;
    return (
      <Box
        pl={4}
        pt={4}
        w="360px"
        borderRadius={"4px"}
        boxShadow="lg"
        position={"absolute"}
        top={"100px"}
        backgroundColor={"bg.default"}
        zIndex={2}
        ref={ref}
        display={isVisible ? "block" : "none"}
      >
        <Button
          variant="link"
          size="xs"
          mb={4}
          onClick={() => {
            const handler = allColumnsHandler();
            handler({ target: { checked: true } });
          }}
        >
          {localization.columnFeatures?.hideShow.showAll}
        </Button>
        <Flex
          h="324px"
          w="full"
          overflowY="scroll"
          flexDirection="column"
          gap="4"
          className={scrollBar()}
        >
          {columns.map((column) => {
            return (
              <Checkbox
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(e: { checked: boolean }) =>
                  column.getToggleVisibilityHandler()({
                    target: { checked: e.checked },
                  })
                }
                data-testid={`hide-show-${column.columnDef.header?.toString() || column.id}`}
              >
                {column.columnDef.header?.toString() || column.id}
              </Checkbox>
            );
          })}
        </Flex>
      </Box>
    );
  },
);

HideShow.displayName = "HideShow";
