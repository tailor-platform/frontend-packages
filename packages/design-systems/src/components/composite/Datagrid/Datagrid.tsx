import { Column as ColumnTanstak, flexRender } from "@tanstack/react-table";
import {
  Columns as ColumnsIcon,
  Filter as FilterIcon,
  Rows as RowsIcon,
  Download as DownloadIcon,
} from "lucide-react";
import {
  CSSProperties,
  DragEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { css } from "@tailor-platform/styled-system/css";
import {
  datagrid,
  type DatagridVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { styled } from "@tailor-platform/styled-system/jsx";
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
import { Density } from "./Density/Density";
import { Export } from "./Export/Export";
import { ManualPagination, Pagination } from "./Pagination";
import { Column, type DataGridInstance } from "./types";
import { useClickOutside } from "./hooks/useClickOutside";

type DataGridProps<TData extends Record<string, unknown>> = {
  table: DataGridInstance<TData>;
} & DatagridVariantProps;

export const DataGrid = <TData extends Record<string, unknown>>(
  props: DataGridProps<TData>,
) => {
  const { table, size } = props;
  const { density, densityOpen, exportOptions } = table.getState();
  const colSpan = table
    .getHeaderGroups()
    .reduce((acc, headerGroup) => acc + headerGroup.headers.length, 0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnsHideShowOpen, setColumnsHideShowOpen] = useState(false);
  const [cusotmFilterFields, setCustomFilterFields] = useState<Column<TData>[]>(
    [],
  );
  const [exportOpen, setExportOpen] = useState(false);
  const localization = table.localization || LOCALIZATION_EN;
  const datagridClasses = datagrid({ size });

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
  const densityRef = useRef<HTMLDivElement>(null);
  const densityButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(
    densityRef,
    () => table.setDensityOpen(false),
    densityButtonRef,
  );
  const exportRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(exportRef, () => setExportOpen(false), exportButtonRef);

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
    isHeader?: boolean,
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
      position: isHeader || isPinned ? "sticky" : "relative",
      opacity: isPinned ? 0.95 : 1,
      zIndex: isPinned ? 1 : 0,
      backgroundColor: isHeader || isPinned ? "white" : "inherit",
    };
  };

  useEffect(() => {
    //Get header titles from table columns
    const cusotmFilterFields: Column<TData>[] = table.columns.flatMap(
      (column) => {
        if ("accessorKey" in column) {
          return [
            {
              //This is temporary structure, we will change this logic in coming days as required
              label: column.header as string,
              value: column.header as string,
              accessorKey: column.accessorKey as string,
              disabled: false,
              meta: column.meta,
            },
          ];
        } else {
          return [];
        }
      },
    );

    setCustomFilterFields(cusotmFilterFields);
  }, [table]);

  return (
    <Stack gap={4} position={"relative"}>
      <HStack gap={4}>
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
              <Text marginLeft={2}>{localization.filter.columnLabel}</Text>
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
              <Text marginLeft={2}>{localization.filter.filterLabel}</Text>
            </Button>
          </HStack>
        )}
        {table.enableDensity && (
          <HStack>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                table.setDensityOpen(!densityOpen);
              }}
              ref={densityButtonRef}
              data-testid="datagrid-density-button"
            >
              <RowsIcon />
              <Text marginLeft={2}>{localization.density.densityLabel}</Text>
            </Button>
          </HStack>
        )}
        {table.getEnableExport() && (
          <HStack>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setExportOpen(!exportOpen);
              }}
              ref={exportButtonRef}
              data-testid="datagrid-export-button"
            >
              <DownloadIcon />
              <Text marginLeft={2}>{localization.export.exportLabel}</Text>
            </Button>
          </HStack>
        )}
      </HStack>
      {table.enableHiding && (
        <HideShow
          allColumnsHandler={table.getToggleAllColumnsVisibilityHandler}
          columns={
            table.getAllLeafColumns() as ColumnTanstak<
              Record<string, unknown>,
              unknown
            >[]
          }
          localization={localization}
          isVisible={columnsHideShowOpen}
          ref={hideShowRef}
        />
      )}
      {table.enableColumnFilters && (
        <CustomFilter
          columns={cusotmFilterFields}
          onChange={(filters) => {
            table.onFilterChange && table.onFilterChange(filters);
          }}
          localization={localization}
          isVisible={filterOpen}
          ref={filterRef}
          defaultFilter={table.defaultFilter}
        />
      )}
      {table.enableDensity && (
        <Density
          setDensity={table.setDensity}
          localization={localization}
          isVisible={densityOpen}
          ref={densityRef}
        />
      )}
      {table.getEnableExport() && (
        <Export
          exportOptions={exportOptions}
          localization={localization}
          isVisible={exportOpen}
          exportCsv={table.exportCsv}
          ref={exportRef}
        />
      )}
      <styled.div className={datagridClasses.wrapper}>
        <Table className={datagridClasses.table} overflow={"visible"}>
          <TableHeader className={datagridClasses.tableHeader}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className={datagridClasses.tableRow}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={datagridClasses.tableHead}
                    style={{
                      minWidth:
                        header.id === "select" ? "54px" : header.getSize(), //First column with checkboxes
                      ...getCommonPinningStyles(header.column, true),
                      height: density === "sm" ? "auto" : "initial",
                      paddingTop:
                        density === "sm"
                          ? "0.5rem"
                          : density === "md"
                            ? "1rem"
                            : "1.5rem",
                      paddingBottom:
                        density === "sm"
                          ? "0.5rem"
                          : density === "md"
                            ? "1rem"
                            : "1.5rem",
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
                    data-testid={`datagrid-header-${header.id}`}
                  >
                    <div
                      className={css({
                        display: "flex",
                        alignItems: "center",
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
          <TableBody className={datagridClasses.tableBody}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={datagridClasses.tableRow}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (
                      cell.column.columnDef.meta &&
                      cell.column.columnDef.meta.type === "enum"
                    ) {
                      const enumValues = cell.column.columnDef.meta.enumType;
                      const enumValue = enumValues?.[
                        cell.getValue() as string
                      ] as ReactNode;
                      return (
                        <TableCell
                          key={cell.id}
                          className={datagridClasses.tableData}
                          style={{
                            ...getCommonPinningStyles(cell.column),
                            paddingTop:
                              density === "sm"
                                ? "0.5rem"
                                : density === "md"
                                  ? "1rem"
                                  : "1.5rem",
                            paddingBottom:
                              density === "sm"
                                ? "0.5rem"
                                : density === "md"
                                  ? "1rem"
                                  : "1.5rem",
                          }}
                        >
                          {enumValue}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        className={datagridClasses.tableData}
                        style={{
                          ...getCommonPinningStyles(cell.column),
                          paddingTop:
                            density === "sm"
                              ? "0.5rem"
                              : density === "md"
                                ? "1rem"
                                : "1.5rem",
                          paddingBottom:
                            density === "sm"
                              ? "0.5rem"
                              : density === "md"
                                ? "1rem"
                                : "1.5rem",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  {localization.datagrid.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </styled.div>
      {table.enablePagination &&
        (table.manualPagination ? (
          <ManualPagination table={table} localization={localization} />
        ) : (
          <Pagination table={table} localization={localization} />
        ))}
    </Stack>
  );
};
