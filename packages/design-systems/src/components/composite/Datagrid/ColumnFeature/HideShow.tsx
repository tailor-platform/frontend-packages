import { ForwardedRef, forwardRef } from "react";
import { scrollBar } from "@tailor-platform/styled-system/recipes";
import type { Column } from "@tanstack/react-table";
import { Button } from "../../../Button";
import { Checkbox } from "../../../Checkbox";
import { Box } from "../../../patterns/Box";
import { Flex } from "../../../patterns/Flex";
import type { Localization } from "../../../../locales/types";

type HideShowProps<TData extends Record<string, unknown>> = {
  allColumnsHandler: () => (event: unknown) => void;
  columns: Column<TData>[];
  localization: Localization;
  ref?: ForwardedRef<HTMLDivElement>;
  isVisible: boolean;
};

export const HideShow = <TData extends Record<string, unknown>>(
  props: HideShowProps<TData>,
) => {
  const HideShowComponent = forwardRef(
    (props: HideShowProps<TData>, ref: ForwardedRef<HTMLDivElement>) => {
      const { allColumnsHandler, columns, localization, isVisible } = props;
      return (
        <Box
          pl={4}
          pt={4}
          w="360px"
          borderRadius={"4px"}
          boxShadow="lg"
          position={"absolute"}
          backgroundColor={"bg.default"}
          zIndex={1}
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
  HideShowComponent.displayName = "HideShow";
  return <HideShowComponent {...props} />;
};
