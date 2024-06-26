import { DragEvent, useCallback, useState } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { css, cx } from "@tailor-platform/styled-system/css";
import {
  datagrid,
  density as densityRecipe,
  type DatagridVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { LOCALIZATION_EN } from "@locales";
import { DataGridInstance } from "../types";
import { TableHead as Root } from "../../../Table";
import { SortingColumn } from "./Sorting";
import { PinnedColumn, getCommonPinningStyles } from "./PinnedColumn";

type TableHeadProps<TData extends Record<string, unknown>> = {
  header: Header<TData, unknown>;
  table: DataGridInstance<TData>;
  size: DatagridVariantProps["size"];
};

export const TableHead = <TData extends Record<string, unknown>>({
  header,
  table,
  size,
}: TableHeadProps<TData>) => {
  const localization = table.localization || LOCALIZATION_EN;
  const datagridClasses = datagrid({ size });
  const densitySmClasses = densityRecipe({ size: "sm" });
  const densityMdClasses = densityRecipe({ size: "md" });
  const densityLgClasses = densityRecipe({ size: "lg" });
  const { density } = table.getState();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [columnBeingDragged, setColumnBeingDragged] = useState<
    number | undefined
  >();

  const onDragStart = useCallback(
    (event: DragEvent<HTMLTableCellElement>): void => {
      setColumnBeingDragged(Number(event.currentTarget.dataset.columnIndex));
    },
    [],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLTableCellElement>): void => {
      event.preventDefault();
      if (columnBeingDragged === undefined) return;
      const newPosition = Number(event.currentTarget.dataset.columnIndex);
      const currentCols = table.getVisibleLeafColumns().map((c) => c.id);
      const colToBeMoved = currentCols.splice(columnBeingDragged, 1);
      currentCols.splice(newPosition, 0, colToBeMoved[0]);
      table.setColumnOrder(currentCols);
    },
    [columnBeingDragged, table],
  );

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
        ...getCommonPinningStyles(header.column, true),
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
