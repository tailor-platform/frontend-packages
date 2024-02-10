"use client";

import { flexRender } from "@tanstack/react-table";
import { Columns as ColumnsIcon, Filter as FilterIcon, MoreVertical as MoreVerticalIcon } from "lucide-react";
import { Pagination } from "@ark-ui/react";
import { DragEvent, useCallback, useEffect, useState } from "react";

import { HStack, Stack } from "@tailor-platform/styled-system/jsx";
import { pagination } from "@tailor-platform/styled-system/recipes";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@tailor-platform/design-systems";
import { css } from "@tailor-platform/styled-system/css";

import { Column, ColumnMetaWithTypeInfo, type DataGridInstance } from "@types";
import { HideShow } from "./ColumnFeature/HideShow";
import { CustomFilter } from "./SearchFilter/CustomFilter";
import "./index.css";
import { Localization_EN } from "./locales/en";

const classes = pagination();

export const DataGrid = <TData extends Record<string, unknown>>({
  table,
}: {
  table: DataGridInstance<TData>;
}) => {
  const colSpan = table
    .getHeaderGroups()
    .reduce((acc, headerGroup) => acc + headerGroup.headers.length, 0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnsHideShowOpen, setColumnsHideShowOpen] = useState(false);
  const [columnHeaders, setColumnHeaders] = useState<Column<TData>[]>([]);
  const localization = table.localization || Localization_EN;

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
      table.setColumnOrder(currentCols); // <------------------------here you save the column ordering state
    },
    [columnBeingDragged, table],
  );

  useEffect(() => {
    //Get header titles
    const columnHeaders: Column<TData>[] = [];
    table.getHeaderGroups().map((headerGroup) => {
      headerGroup.headers.map((header) => {
        columnHeaders.push({
          //This is temporary structure, we will change this logic in coming days as required
          label: header.column.columnDef.header as string,
          value: header.column.columnDef.header as string,
          meta: header.column.columnDef.meta as ColumnMetaWithTypeInfo<TData>,
          disabled: false,
        });
      });
    });
    setColumnHeaders(columnHeaders);
  }, [table]);

  return (
    <Stack gap={4}>
      {table.enableHiding && (
        <HStack>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setColumnsHideShowOpen(!columnsHideShowOpen);
            }}
          >
            <ColumnsIcon />
            <Text marginLeft={"4px"}>{localization.filter.columnLabel}</Text>
          </Button>
        </HStack>
      )}

      {table.enableColumnFilters && (
        <HStack>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setFilterOpen(!filterOpen);
            }}
          >
            <FilterIcon />
            <Text marginLeft={"4px"}>{localization.filter.filterLabel}</Text>
          </Button>
        </HStack>
      )}

      <Table
        className={css({
          borderWidth: "0.5px",
          borderColor: "border.default",
        })}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={css({
                    position: "relative",
                    borderWidth: "0.5px",
                    borderColor: "border.default",
                  })}
                  style={{
                    width: header.id === "select" ? "40px" : header.getSize(), //First column with checkboxes
                  }}
                  draggable={
                    !table.getState().columnSizingInfo.isResizingColumn
                  }
                  data-column-index={header.index}
                  onDragStart={onDragStart}
                  onDragOver={(e): void => {
                    e.preventDefault();
                  }}
                  onDrop={onDrop}
                >
                  {!header.isPlaceholder &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={css({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        height: "100%",
                        width: "4px",
                        background: "rgba(0, 0, 0, 0.5)",
                        cursor: "col-resize",
                        userSelect: "none",
                        touchAction: "none",
                        opacity: 0, //Hide by default
                        _hover: {
                          opacity: 1, //Show on hover
                        },
                      })}
                    ></div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {filterOpen && (
          <CustomFilter
            columns={columnHeaders}
            onChange={(filters) => {
              table.onFilterChange && table.onFilterChange(filters);
            }}
            localization={localization}
          />
        )}
        {columnsHideShowOpen && (
          <HideShow
            allColumnsHandler={table.getToggleAllColumnsVisibilityHandler}
            columns={table.getAllLeafColumns()}
            localization={localization}
          />
        )}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={css({
                      borderWidth: "0.5px",
                      borderColor: "border.default",
                    })}
                  >
                    <div
                      className={css({
                        display: "flex",
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      <MoreVerticalIcon/>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan}>No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {table.enablePagination && (
        <Pagination.Root
          className={classes.root}
          count={table.totalCount || 0}
          pageSize={table.initialState.pagination.pageSize}
          siblingCount={2}
          onPageChange={(details) => {
            if (table?.getState && table?.handlePageChange) {
              const state = table.getState();
              if (state.pagination) {
                table.handlePageChange({
                  page: details.page,
                  pageSize: details.pageSize,
                });
              }
            }
          }}
        >
          {({ pages }) => (
            <>
              <HStack gap={1}>
                <Pagination.PrevTrigger asChild>
                  <Button variant="secondary" size="md">
                    Previous
                  </Button>
                </Pagination.PrevTrigger>

                {pages.map((page, index) =>
                  page.type === "page" ? (
                    <Pagination.Item
                      className={classes.item}
                      {...page}
                      key={index}
                      asChild
                    >
                      <Button variant="tertiary" size="md">
                        {page.value}
                      </Button>
                    </Pagination.Item>
                  ) : (
                    <Pagination.Ellipsis
                      className={classes.ellipsis}
                      key={index}
                      index={index}
                    >
                      &#8230;
                    </Pagination.Ellipsis>
                  ),
                )}

                <Pagination.NextTrigger asChild>
                  <Button variant="secondary" size="md">
                    Next
                  </Button>
                </Pagination.NextTrigger>
              </HStack>
            </>
          )}
        </Pagination.Root>
      )}
    </Stack>
  );
};
