import { useRef } from "react";
import {
  RowData,
  Table,
  TableFeature,
  makeStateUpdater,
} from "@tanstack/react-table";
import { ColumnsIcon } from "lucide-react";
import { scrollBar } from "@tailor-platform/styled-system/recipes";
import { Button } from "../../../Button";
import { Checkbox } from "../../../Checkbox";
import { Box } from "../../../patterns/Box";
import { Flex } from "../../../patterns/Flex";
import { addEventOutside } from "../addEventOutside";
import { useGetBoxPosition } from "../useGetBoxPosition";
import type {
  HideShowOptions,
  HideShowProps,
  HideShowTableState,
} from "./types";
import { HStack } from "@components/patterns/HStack";
import { Text } from "@components/Text";
import { LOCALIZATION_EN } from "@locales";

export const HideShow = <TData extends Record<string, unknown>>(
  props: HideShowProps<TData>,
) => {
  const allColumnsHandler = props.table.getToggleAllColumnsVisibilityHandler;
  const columns = props.table.getAllLeafColumns();
  const setHideShowOpen = props.table.setHideShowOpen;
  const { hideShowOpen } = props.table.getState();
  const localization = props.table.localization || LOCALIZATION_EN;
  const { size = "md", variant = "secondary" } = props;
  const hideShowRef = useRef<HTMLDivElement>(null);
  const hideShowButtonRef = useRef<HTMLButtonElement>(null);

  const getBoxPosition = useGetBoxPosition(hideShowButtonRef);

  if (!props.table.enableHiding) {
    return null;
  }

  return (
    <>
      <HStack>
        <Button
          variant={variant}
          size={size}
          onClick={() => {
            setHideShowOpen(!hideShowOpen);
            addEventOutside(
              hideShowRef,
              () => setHideShowOpen(false),
              hideShowButtonRef,
            );
          }}
          ref={hideShowButtonRef}
          data-testid="datagrid-hide-show-button"
        >
          <ColumnsIcon width={20} height={20} />
          <Text marginLeft={2}>{localization.filter.columnLabel}</Text>
        </Button>
      </HStack>
      <Box
        pl={4}
        pt={4}
        w="360px"
        borderRadius={"4px"}
        boxShadow="lg"
        backgroundColor={"bg.default"}
        zIndex={2}
        ref={hideShowRef}
        display={hideShowOpen ? "block" : "none"}
        style={{
          ...getBoxPosition(),
        }}
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
          {columns.map((column, i) => {
            return (
              <Checkbox
                key={i}
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
    </>
  );
};

HideShow.displayName = "HideShow";

export const HideShowFeature: TableFeature = {
  getInitialState: (state): HideShowTableState => {
    return {
      hideShowOpen: false,
      ...state,
    };
  },
  getDefaultOptions: (): HideShowOptions => {
    return {
      enableHideShow: true,
    };
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setHideShowOpen = makeStateUpdater("hideShowOpen", table);
  },
};
