import { CSSProperties, DragEvent, useCallback, useState } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { css } from "@tailor-platform/styled-system/css";
import {
  datagrid,
  type DatagridVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { DataGridInstance } from "../types";
import { TableHead as Root } from "../../../Table";
import { SortingColumn } from "./Sorting";
import { PinnedColumn } from "./PinnedColumn";
import { Localization } from "@locales/types";

type TableHeadProps<TData extends Record<string, unknown>> = {
  header: Header<Record<string, unknown>, unknown>;
  table: DataGridInstance<TData>;
  columnPiningStyles: CSSProperties;
  size: DatagridVariantProps["size"];
  localization: Localization;
  onDragStart: (event: DragEvent<HTMLTableCellElement>) => void;
  onDrop: (event: DragEvent<HTMLTableCellElement>) => void;
};

export const TableHead = <TData extends Record<string, unknown>>({
  header,
  table,
  columnPiningStyles,
  size,
  localization,
  onDragStart,
  onDrop,
}: TableHeadProps<TData>) => {
  const datagridClasses = datagrid({ size });
  const { density } = table.getState();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDisplaySortIcon = useCallback(() => {
    return !!header.column.getIsSorted() || isHovered;
  }, [isHovered, header.column]);

  return (
    <Root
      colSpan={header.colSpan}
      className={datagridClasses.tableHead}
      style={{
        minWidth: header.id === "select" ? "54px" : header.getSize(), //First column with checkboxes
        ...columnPiningStyles,
        height: density === "sm" ? "auto" : "initial",
        paddingTop:
          density === "sm" ? "0.5rem" : density === "md" ? "1rem" : "1.5rem",
        paddingBottom:
          density === "sm" ? "0.5rem" : density === "md" ? "1rem" : "1.5rem",
      }}
      draggable={!table.getState().columnSizingInfo.isResizingColumn}
      data-column-index={header.index}
      onDragStart={onDragStart}
      onDragOver={(e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
      }}
      onDrop={onDrop}
      data-testid={`datagrid-header-${header.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (header.column.getCanSort()) {
          header.column.toggleSorting();
          if (table.onSortChange) {
            table.onSortChange(
              header.column.getNextSortingOrder()
                ? {
                    field: header.column.id,
                    direction:
                      header.column.getNextSortingOrder() === "desc"
                        ? "Desc"
                        : "Asc",
                  }
                : undefined,
            );
          }
        }
      }}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "1",
        })}
      >
        {!header.isPlaceholder &&
          flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={datagridClasses.tableHeadDivider}
          ></div>
        )}
        {table.enableSorting && (
          <SortingColumn
            header={header}
            isDisplaySortIcon={isDisplaySortIcon}
          />
        )}
        {header.id !== "select" && (
          <PinnedColumn column={header.column} localization={localization} />
        )}
      </div>
    </Root>
  );
};
