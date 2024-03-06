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
};

export const HideShow = <TData extends Record<string, unknown>>({
  allColumnsHandler,
  columns,
  localization,
}: HideShowProps<TData>) => {
  return (
    <Box
      pl={4}
      pt={4}
      w="360px"
      borderRadius={"4px"}
      boxShadow="lg"
      position={"absolute"}
      backgroundColor={"bg.default"}
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
            >
              {column.columnDef.header?.toString() || column.id}
            </Checkbox>
          );
        })}
      </Flex>
    </Box>
  );
};
