import { useMemo } from "react";
import { Select as AS, CollectionItem } from "@ark-ui/react/select";
import { Portal } from "@ark-ui/react/portal";
import { styled } from "@tailor-platform/styled-system/jsx";
import { select } from "@tailor-platform/styled-system/recipes";
import {
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  ChevronDown,
  CheckIcon,
} from "lucide-react";
import { DataGridInstance } from "../types";
import { HStack } from "../../../patterns/HStack";
import { Text } from "../../../Text";
import { Button } from "../../../Button";
import { IconButton } from "../../../IconButton";

const classes = select();

interface ValueChangeDetails<T extends CollectionItem = CollectionItem> {
  value: string[];
  items: T[];
}

const Select = {
  Root: styled(AS.Root),
  ClearTrigger: styled(AS.ClearTrigger),
  Content: styled(AS.Content),
  Control: styled(AS.Control),
  Item: styled(AS.Item),
  ItemGroup: styled(AS.ItemGroup),
  ItemGroupLabel: styled(AS.ItemGroupLabel),
  ItemIndicator: styled(AS.ItemIndicator),
  ItemText: styled(AS.ItemText),
  Label: styled(AS.Label),
  Positioner: styled(AS.Positioner),
  Trigger: styled(AS.Trigger),
  ValueText: styled(AS.ValueText),
};

type Page = {
  index: number;
  type: "page" | "ellipsis";
};

const ELLIPSIS_SIZE = 4;

export const Pagination = <TData extends Record<string, unknown>>({
  table,
}: {
  table: DataGridInstance<TData>;
}) => {
  const pageIndex = useMemo(
    () => table.getState().pagination.pageIndex,
    [table],
  );
  const pageSize = useMemo(() => table.getState().pagination.pageSize, [table]);
  const from = useMemo(() => pageIndex * pageSize + 1, [pageIndex, pageSize]);
  const to = useMemo(() => from + pageSize - 1, [from, pageSize]);

  const pages: Page[] = useMemo(() => {
    const pageCount = table.totalCount
      ? Math.ceil(table.totalCount / pageSize)
      : 0;
    const pageList = [...Array(pageCount).keys()];
    return pageList
      .filter((i) => Math.abs(i - pageIndex) < ELLIPSIS_SIZE + 1)
      .map((p) => {
        return {
          index: p,
          type: Math.abs(p - pageIndex) === ELLIPSIS_SIZE ? "ellipsis" : "page",
        };
      });
  }, [table, pageIndex, pageSize]);

  const selectList = ["5", "20", "50", "100", "500", "1000"];

  return (
    <HStack justifyContent={"flex-end"} gap={8}>
      <HStack>
        <Text>ページあたり行数</Text>
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
          data-testid="select-joint-condition"
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
                  data-testid="select-joint-condition-options"
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
        <Text fontWeight={"bold"}>{table.getRowCount()}</Text>
        件中
        <Text fontWeight={"bold"}>
          {from}-
          {table.totalCount && to > table.totalCount ? table.totalCount : to}
        </Text>
        件
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
