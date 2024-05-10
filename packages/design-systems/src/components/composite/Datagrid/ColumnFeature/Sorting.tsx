import { Header } from "@tanstack/react-table";
import { css, cx } from "@tailor-platform/styled-system/css";
import {
  ArrowDown as ArrowDownIcon,
  ArrowUp as ArrowUpIcon,
} from "lucide-react";
import { sorting } from "@tailor-platform/styled-system/recipes";

type SortingColumnProps<TData extends Record<string, unknown>> = {
  header: Header<TData, unknown>;
  isDisplaySortIcon: () => boolean;
};

export const SortingColumn = <TData extends Record<string, unknown>>({
  header,
  isDisplaySortIcon,
}: SortingColumnProps<TData>) => {
  const classes = sorting();
  const muteClasses = sorting({ color: "muted" });
  return (
    <div
      className={cx(
        header.column.getCanSort() ? classes.wrapper : "",
        css({ visibility: isDisplaySortIcon() ? "visible" : "hidden" }),
      )}
      title={
        header.column.getCanSort()
          ? header.column.getNextSortingOrder() === "asc"
            ? "Sort ascending"
            : header.column.getNextSortingOrder() === "desc"
              ? "Sort descending"
              : "Clear sort"
          : undefined
      }
    >
      {{
        asc: <ArrowUpIcon className={classes.icon} />,
        desc: <ArrowDownIcon className={classes.icon} />,
      }[header.column.getIsSorted() as string] ?? (
        <ArrowDownIcon className={muteClasses.icon} />
      )}
    </div>
  );
};
