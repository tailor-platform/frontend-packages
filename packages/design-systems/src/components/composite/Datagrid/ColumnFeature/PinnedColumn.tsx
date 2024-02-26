import { useState } from "react";
import { Box } from "@tailor-platform/styled-system/jsx";
import type { Column } from "@tanstack/react-table";
import { css } from "@tailor-platform/styled-system/css";
import { MoreVertical as MoreVerticalIcon } from "lucide-react";
import { Button } from "../../../Button";
import type { Localization } from "../../../../locales/types";

type PinnedColumnProps<TData extends Record<string, unknown>> = {
  column: Column<TData>;
  localization: Localization;
};

export const PinnedColumn = <TData extends Record<string, unknown>>({
  column,
  localization,
}: PinnedColumnProps<TData>) => {
  const [isOpenedPinnedColumnModal, setIsOpenedPinnedColumnModal] =
    useState<boolean>(false);

  return (
    <div
      className={css({
        marginLeft: "auto",
      })}
    >
      <MoreVerticalIcon
        aria-label="Open Pinned Column Modal"
        className={css({
          cursor: "pointer",
        })}
        onClick={() => {
          setIsOpenedPinnedColumnModal(!isOpenedPinnedColumnModal);
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
              column.pin("right");
              setIsOpenedPinnedColumnModal(false);
            }}
          >
            {localization.columnFeatures.pinnedColumn.pinnedRight}
          </Button>
          <Button
            variant="link"
            size="xs"
            mb={4}
            onClick={() => {
              column.pin("left");
              setIsOpenedPinnedColumnModal(false);
            }}
          >
            {localization.columnFeatures.pinnedColumn.pinnedLeft}
          </Button>
        </Box>
      )}
    </div>
  );
};
