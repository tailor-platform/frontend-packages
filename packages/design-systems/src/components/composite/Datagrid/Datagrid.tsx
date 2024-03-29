import { Column as ColumnTanstak, flexRender } from "@tanstack/react-table";
import { Columns as ColumnsIcon, Filter as FilterIcon } from "lucide-react";
import {
  CSSProperties,
  DragEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { css } from "@tailor-platform/styled-system/css";
import { datagrid } from "@tailor-platform/styled-system/recipes";
import { LOCALIZATION_EN } from "../../../locales/en";
import { Button } from "../../Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Table";
import { Text } from "../../Text";
import { HStack } from "../../patterns/HStack";
import { Stack } from "../../patterns/Stack";
import { HideShow } from "./ColumnFeature/HideShow";
import { PinnedColumn } from "./ColumnFeature/PinnedColumn";
import { CustomFilter } from "./SearchFilter/CustomFilter";
import { ManualPagination, Pagination } from "./Pagination";
import { Column, ColumnMetaWithTypeInfo, type DataGridInstance } from "./types";
import { useClickOutside } from "./hooks/useClickOutside";

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
  const localization = table.localization || LOCALIZATION_EN;

  const [columnBeingDragged, setColumnBeingDragged] = useState<
    number | undefined
  >();
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(filterRef, () => setFilterOpen(false), filterButtonRef, true);
  const hideShowRef = useRef<HTMLDivElement>(null);
  const hideShowButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(
    hideShowRef,
    () => setColumnsHideShowOpen(false),
    hideShowButtonRef,
  );

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

  const getCommonPinningStyles = (
    column: ColumnTanstak<TData>,
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
      isPinned === "right" && column.getIsFirstColumn("right");

    return {
      boxShadow: isLastLeftPinnedColumn
        ? "-4px 0 4px -4px gray inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px gray inset"
          : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? "sticky" : "relative",
      zIndex: isPinned ? 1 : 0,
      backgroundColor: isPinned ? "white" : "inherit",
    };
  };

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
      <HStack gap={4} position={"relative"}>
        {table.enableHiding && (
          <HStack>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setColumnsHideShowOpen(!columnsHideShowOpen);
              }}
              ref={hideShowButtonRef}
              data-testid="datagrid-hide-show-button"
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
              ref={filterButtonRef}
              data-testid="datagrid-filter-button"
            >
              <FilterIcon />
              <Text marginLeft={"4px"}>{localization.filter.filterLabel}</Text>
            </Button>
          </HStack>
        )}
      </HStack>
      <CustomFilter
        columns={columnHeaders}
        onChange={(filters) => {
          table.onFilterChange && table.onFilterChange(filters);
        }}
        localization={localization}
        ref={filterRef}
        isVisible={filterOpen}
      />
      <Table className={datagridClasses.table}>
        <TableHeader className={datagridClasses.tableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className={datagridClasses.tableRow} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={datagridClasses.tableHead}
                  style={{
                    width: header.id === "select" ? "54px" : header.getSize(), //First column with checkboxes
                    ...getCommonPinningStyles(header.column),
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
                  data-testid={`datagrid-header-${header.column.columnDef.header || header.id}`}
                >
                  <div
                    className={css({
                      display: "flex",
                    })}
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
                    {header.id !== "select" && (
                      <PinnedColumn
                        column={header.column}
                        localization={localization}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {columnsHideShowOpen && (
          <HideShow
            allColumnsHandler={table.getToggleAllColumnsVisibilityHandler}
            columns={
              table.getAllLeafColumns() as ColumnTanstak<
                Record<string, unknown>,
                unknown
              >[]
            }
            localization={localization}
            ref={hideShowRef}
          />
        )}
        <TableBody className={datagridClasses.tableBody}>
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
                    style={{ ...getCommonPinningStyles(cell.column) }}
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
      {table.enablePagination &&
        (table.manualPagination ? (
          <ManualPagination table={table} />
        ) : (
          <Pagination table={table} />
        ))}
    </Stack>
  );
};
