"use client";

import { flexRender } from "@tanstack/react-table";
import { Columns as ColumnsIcon, Filter as FilterIcon } from "lucide-react";
import { Pagination } from "@ark-ui/react";
import { DragEvent, useCallback, useEffect, useState } from "react";

import { HStack, Stack } from "@tailor-platform/styled-system/jsx";
import { pagination, datagrid } from "@tailor-platform/styled-system/recipes";
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

import { Column, ColumnMetaWithTypeInfo, type DataGridInstance } from "@types";
import { HideShow } from "./ColumnFeature/HideShow";
import { CustomFilter } from "./SearchFilter/CustomFilter";
import "./index.css";
import { Localization_EN } from "./locales/en";

const classes = pagination();
const datagridClasses = datagrid();

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

      <Table className={datagridClasses.table}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className={datagridClasses.tableRow} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={datagridClasses.tableHead}
                  style={{
                    width: header.id === "select" ? "40px" : header.getSize(), //First column with checkboxes
                  }}
                  draggable={
                    !table.getState().columnSizingInfo.isResizingColumn
                  }
                  data-column-index={header.index}
                  onDragStart={onDragStart}
                  onDragOver={(e: DragEvent<HTMLDivElement>): void => {
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
                      className={datagridClasses.tableHeadDivider}
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
                className={datagridClasses.tableRow}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={datagridClasses.tableData}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
