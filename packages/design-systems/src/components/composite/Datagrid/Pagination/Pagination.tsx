import { useMemo } from "react";
import { CollectionItem } from "@ark-ui/react/select";
import { Portal } from "@ark-ui/react/portal";
import { select } from "@tailor-platform/styled-system/recipes";
import { HStack } from "@tailor-platform/styled-system/jsx";
import {
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  ChevronDown,
  CheckIcon,
} from "lucide-react";
import { DataGridInstance, ValueChangeDetails } from "../types";
import { Text } from "../../../Text";
import { Button } from "../../../Button";
import { IconButton } from "../../../IconButton";
import { selectList, Select, usePagination } from "./utils";
import { Localization } from "@locales/types";

const classes = select();

export const Pagination = <TData extends Record<string, unknown>>({
  table,
  localization,
}: {
  table: DataGridInstance<TData>;
  localization: Localization;
}) => {
  const pageIndex = useMemo(
    () => table.getState().pagination.pageIndex,
    [table],
  );
  const pageSize = useMemo(() => table.getState().pagination.pageSize, [table]);
  const { from, to, pages } = usePagination(table, pageIndex, pageSize);

  return (
    <HStack justifyContent={"flex-end"} gap={8}>
      <HStack>
        <Text>{localization.pagination.rowsPerPage}</Text>
        <Select.Root
          className={classes.root}
          items={selectList}
          positioning={{ sameWidth: true }}
          closeOnSelect
          onValueChange={(e: ValueChangeDetails<CollectionItem>) => {
            const selectedPageSize = Number(e.items[0]) ?? 0;
            table.setPageSize(selectedPageSize);
          }}
          defaultValue={[pageSize.toString()]}
          width={16}
          data-testid="select-pagination-page-size"
        >
          <Select.Control className={classes.control}>
            <Select.Trigger className={classes.trigger}>
              <Select.ValueText
                className={classes.valueText}
                color="fg.subtle"
              />
              <ChevronDown />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner className={classes.positioner}>
              <Select.Content className={classes.content}>
                <Select.ItemGroup
                  className={classes.itemGroup}
                  id="jointConditions"
                  data-testid="select-page-size-options"
                >
                  {selectList.map((item) => (
                    <Select.Item
                      className={classes.item}
                      key={"pageSize" + item}
                      item={item}
                    >
                      <Select.ItemText className={classes.itemText}>
                        {item}
                      </Select.ItemText>
                      <Select.ItemIndicator className={classes.itemIndicator}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>
      <HStack gap={2}>
        {localization.pagination.of === "of" ? (
          <>
            <Text fontWeight={"bold"}>
              {from}-
              {table.totalCount && to > table.totalCount
                ? table.totalCount
                : to}
            </Text>
            {localization.pagination.of}
            <Text fontWeight={"bold"}>{table.getRowCount()}</Text>
          </>
        ) : (
          <>
            <Text fontWeight={"bold"}>{table.getRowCount()}</Text>
            {localization.pagination.of}
            <Text fontWeight={"bold"}>
              {from}-
              {table.totalCount && to > table.totalCount
                ? table.totalCount
                : to}
            </Text>
            {localization.pagination.page}
          </>
        )}
      </HStack>
      <HStack>
        <IconButton
          variant="secondary"
          aria-label="First Page"
          onClick={() => {
            table.firstPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon />
        </IconButton>
        <IconButton
          variant="secondary"
          aria-label="Prev Page"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </IconButton>
        {pages.map((page, index) => {
          if (page.type === "page") {
            return (
              <Button
                key={"pageIndex" + index}
                variant={pageIndex === page.index ? "primary" : "secondary"}
                aria-label="Number Page"
                onClick={() => {
                  table.setPageIndex(page.index);
                }}
              >
                {page.index + 1}
              </Button>
            );
          } else {
            return (
              <Text key={"pageIndex" + index} pb={4}>
                …
              </Text>
            );
          }
        })}
        <IconButton
          variant="secondary"
          aria-label="Next Page"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          variant="secondary"
          aria-label="Last Page"
          onClick={() => {
            table.lastPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon />
        </IconButton>
      </HStack>
    </HStack>
  );
};
