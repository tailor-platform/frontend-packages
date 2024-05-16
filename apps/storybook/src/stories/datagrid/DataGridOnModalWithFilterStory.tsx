"use client";

import {
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  GraphQLQueryFilter,
  useDataGrid,
} from "@tailor-platform/design-systems/client";
import { dialog } from "@tailor-platform/styled-system/recipes";
import { Dialog, Portal } from "@ark-ui/react";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { useState } from "react";
import { Payment } from "../../types/datagrid.ts";
import { setFilterChange } from "./utils.ts";
import { XIcon } from "lucide-react";

export type DataGridWithFilterStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridOnModalWithFilterStory = ({
  enableColumnFilters = false,
}: DataGridWithFilterStoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Payment[]>(originData);
  const query: GraphQLQueryFilter = {
    updatedAt: { eq: "2024-05-10 12:00:00" },
  };
  const defaultQuery: GraphQLQueryFilter = {
    amount: { gt: 200 },
  };
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    systemFilter: query,
    defaultFilter: defaultQuery,
  });
  const dialogClasses = dialog();

  return (
    <Box w="xl">
      <Button
        variant="secondary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open dialog
      </Button>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(e) => {
          setIsOpen(e.open);
        }}
        closeOnInteractOutside={true}
      >
        <Portal>
          <Dialog.Backdrop className={dialogClasses.backdrop} />
          <Dialog.Positioner className={dialogClasses.positioner}>
            <Dialog.Content className={dialogClasses.content}>
              <Box w="xl">
                <HStack
                  borderBottom="1px solid"
                  borderColor="border.default"
                  p={4}
                  justify="space-between"
                  w="xl"
                >
                  <Dialog.Title>
                    <Text textStyle="lg" fontWeight="bold">
                      事業部の検索
                    </Text>
                  </Dialog.Title>
                  <Dialog.CloseTrigger asChild>
                    <IconButton
                      aria-label="Close Dialog"
                      variant="tertiary"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <XIcon />
                    </IconButton>
                  </Dialog.CloseTrigger>
                </HStack>
                <Stack direction="row" width="xl" px={4} pb={6} pt={4}>
                  <DataGrid table={table} />
                </Stack>
              </Box>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

DataGridOnModalWithFilterStory.displayName = "DataGridOnModalWithFilter";
