import { CSSProperties, DragEvent, useCallback, useState } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { css, cx } from "@tailor-platform/styled-system/css";
import {
  datagrid,
  density as densityRecipe,
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
  const densitySmClasses = densityRecipe({ size: "sm" });
  const densityMdClasses = densityRecipe({ size: "md" });
  const densityLgClasses = densityRecipe({ size: "lg" });
  const { density } = table.getState();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDisplaySortIcon = useCallback(() => {
    return !!header.column.getIsSorted() || isHovered;
  }, [isHovered, header.column]);

  return (
    <Root
      colSpan={header.colSpan}
      className={cx(
        datagridClasses.tableHead,
        density === "sm" && densitySmClasses,
        density === "md" && densityMdClasses,
        density === "lg" && densityLgClasses,
      )}
      style={{
        ...columnPiningStyles,
        height: density === "sm" ? "auto" : "initial",
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
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1",
        })}
      >
        <span
          className={datagridClasses.tableHeadText}
          style={{
            width: header.id === "select" ? 20 : header.getSize(), //First column with checkboxes
          }}
        >
          {!header.isPlaceholder &&
            flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        <div
          className={css({
            display: "flex",
          })}
        >
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
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={datagridClasses.tableHeadDivider}
          ></div>
        )}
      </div>
    </Root>
  );
};
