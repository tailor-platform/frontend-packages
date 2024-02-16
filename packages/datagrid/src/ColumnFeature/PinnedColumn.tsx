import { DragEvent, useCallback, useEffect, useState } from "react";
import { Box, Flex } from "@tailor-platform/styled-system/jsx";
import { Button, Checkbox } from "@tailor-platform/design-systems";
import { scrollBar } from "@tailor-platform/styled-system/recipes";
import type { Column, ColumnPinningState, Updater } from "@tanstack/react-table";
import { MoreVertical as MoreVerticalIcon } from "lucide-react";
import { Localization } from "@types";
import { css } from "@tailor-platform/styled-system/css";

type HideShowProps<TData extends Record<string, unknown>> = {
  setColumnPinning: (position: 'right' | 'left') => void;
  localization: Localization;
};

export const PinnedColumn = <TData extends Record<string, unknown>>({
  setColumnPinning,
  localization,
}: HideShowProps<TData>) => {
  const [isOpenedPinnedColumnModal, setIsOpenedPinnedColumnModal] = useState<boolean>(false)

  return (
    <div
      className={css({
        marginLeft: "auto",
      })}
    >
      <MoreVerticalIcon
        className={css({
          cursor: "pointer",
        })}
        onClick={() => {
          setIsOpenedPinnedColumnModal(!isOpenedPinnedColumnModal)
        }}
      />
      {isOpenedPinnedColumnModal && (
        <Box
          pl={4}
          pt={4}
          w="140px"
          h="88px"
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
              setColumnPinning('right')
              setIsOpenedPinnedColumnModal(false)
            }}
          >
            {localization.columnFeatures.pinnedColumn.pinnedRight}
          </Button>
          <Button
            variant="link"
            size="xs"
            mb={4}
            onClick={() => {
              setColumnPinning('left')
              setIsOpenedPinnedColumnModal(false)
            }}
          >
            {localization.columnFeatures.pinnedColumn.pinnedLeft}
          </Button>
        </Box>
      )}
    </div>
    
  );
};
