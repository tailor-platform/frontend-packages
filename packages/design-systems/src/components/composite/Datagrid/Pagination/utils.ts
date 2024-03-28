import { useMemo } from "react";
import { Select as AS } from "@ark-ui/react/select";
import { styled } from "@tailor-platform/styled-system/jsx";
import { DataGridInstance, Page } from "../types";

const ELLIPSIS_SIZE = 4;

export const selectList = ["5", "20", "50", "100", "500", "1000"];

export const usePagination = <TData extends Record<string, unknown>>(
  table: DataGridInstance<TData>,
  pageIndex: number,
  pageSize: number,
) => {
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
  const isNextPage = useMemo(() => {
    const pageCount = table.totalCount
      ? Math.ceil(table.totalCount / pageSize)
      : 0;
    return pageIndex === pageCount - 1;
  }, [pageIndex, pageSize, table]);

  return { from, to, pages, isNextPage };
};

export const Select = {
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
