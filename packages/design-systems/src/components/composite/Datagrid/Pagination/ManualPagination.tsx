import { useState } from "react";
import { type PaginationState } from "@tanstack/react-table";
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
import { LOCALIZATION_EN } from "@locales";
import { CollectionItem } from "@ark-ui/react/dist/types";
import { DataGridInstance } from "../types";
import { Text } from "../../../Text";
import { Button } from "../../../Button";
import { IconButton } from "../../../IconButton";
import type { ValueChangeDetails } from "../SearchFilter/types";
import { Select, usePagination } from "./utils";

export type PageChangeDetails = {
  page: number;
  pageSize: number;
};

const classes = select();

export const ManualPagination = <TData extends Record<string, unknown>>({
  table,
}: {
  table: DataGridInstance<TData>;
}) => {
  const localization = table.localization || LOCALIZATION_EN;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: table.initialState.pagination.pageSize,
  });
  const { from, to, pages, pageCount, isNextPage, pageSizeOptions } =
    usePagination(table, pageIndex, pageSize);
  const handlePageChange = (detail: PageChangeDetails) => {
    table.handlePageChange && table.handlePageChange(detail);
  };

  return (
    <HStack justifyContent={"flex-end"} gap={8}>
      <HStack>
        <Text>{localization.pagination.rowsPerPage}</Text>
        <Select.Root
          className={classes.root}
          items={pageSizeOptions}
          positioning={{ sameWidth: true }}
          closeOnSelect
          onValueChange={(e: ValueChangeDetails<CollectionItem>) => {
            const selectedPageSize = Number(e.items[0]) || 0;
            setPagination({ pageIndex: 0, pageSize: selectedPageSize });
            handlePageChange({ page: 0, pageSize: selectedPageSize });
          }}
          defaultValue={[pageSize.toString()]}
          width={"auto"}
          data-testid="select-manual-pagination-page-size"
        >
          <Select.Control className={classes.control}>
            <Select.Trigger className={classes.trigger}>
              <Select.ValueText className={classes.valueText} />
              <ChevronDown />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner className={classes.positioner}>
            <Select.Content className={classes.content}>
              <Select.ItemGroup
                className={classes.itemGroup}
                id="jointConditions"
                data-testid="select-page-size-options"
              >
                {pageSizeOptions.map((item, i) => (
                  <Select.Item className={classes.item} key={i} item={item}>
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
        </Select.Root>
      </HStack>
      <HStack gap={2}>
        {localization.language === "JA" ? (
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
        ) : (
          <>
            <Text fontWeight={"bold"}>
              {from}-
              {table.totalCount && to > table.totalCount
                ? table.totalCount
                : to}
            </Text>
            {localization.pagination.of}
            <Text fontWeight={"bold"} data-testid="pagination-total-count">
              {table.getRowCount()}
            </Text>
          </>
        )}
      </HStack>
      <HStack>
        <IconButton
          variant="secondary"
          aria-label="First Page"
          onClick={() => {
            setPagination({ pageIndex: 0, pageSize });
            handlePageChange({ page: 0, pageSize });
          }}
          disabled={pageIndex === 0}
        >
          <ChevronsLeftIcon />
        </IconButton>
        <IconButton
          variant="secondary"
          aria-label="Prev Page"
          onClick={() => {
            setPagination({ pageIndex: pageIndex - 1, pageSize });
            handlePageChange({ page: pageIndex - 1, pageSize });
          }}
          disabled={pageIndex === 0}
        >
          <ChevronLeftIcon />
        </IconButton>
        {pages.map((page, i) => {
          if (page.type === "page") {
            return (
              <Button
                key={i}
                variant={pageIndex === page.index ? "primary" : "secondary"}
                aria-label="Number Page"
                onClick={() => {
                  setPagination({ pageIndex: page.index, pageSize });
                  handlePageChange({ page: page.index, pageSize });
                }}
              >
                {page.index + 1}
              </Button>
            );
          } else {
            return (
              <Text key={i} pb={4}>
                …
              </Text>
            );
          }
        })}
        <IconButton
          variant="secondary"
          aria-label="Next Page"
          onClick={() => {
            setPagination({ pageIndex: pageIndex + 1, pageSize });
            handlePageChange({ page: pageIndex + 1, pageSize });
          }}
          disabled={isNextPage}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          variant="secondary"
          aria-label="Last Page"
          onClick={() => {
            setPagination({ pageIndex: pageCount - 1, pageSize });
            handlePageChange({ page: pageCount - 1, pageSize });
          }}
          disabled={isNextPage}
        >
          <ChevronsRightIcon />
        </IconButton>
      </HStack>
    </HStack>
  );
};
