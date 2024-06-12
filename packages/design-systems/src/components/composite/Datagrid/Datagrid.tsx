import { Cell, Header, flexRender } from "@tanstack/react-table";
import { cx } from "@tailor-platform/styled-system/css";
import { useCallback, useEffect, useState, ReactNode } from "react";
import {
  datagrid,
  density as densityRecipe,
  type DatagridVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { styled } from "@tailor-platform/styled-system/jsx";
import { LOCALIZATION_EN } from "../../../locales/en";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../Table";
import { HStack } from "../../patterns/HStack";
import { Stack } from "../../patterns/Stack";
import { HideShow } from "./ColumnFeature/HideShow";
import { CustomFilter } from "./SearchFilter/CustomFilter";
import { Density } from "./Density/Density";
import { Export } from "./Export/Export";
import { ManualPagination, Pagination } from "./Pagination";
import { Column, type DataGridInstance } from "./types";
import { TableHead } from "./ColumnFeature/TableHead";
import { getCommonPinningStyles } from "./ColumnFeature/PinnedColumn";

type DataGridProps<TData extends Record<string, unknown>> = {
  table: DataGridInstance<TData>;
} & DatagridVariantProps & {
    toolButtonSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs";
    toolButtonVariant?: "primary" | "secondary" | "link" | "tertiary";
  };

export const DataGrid = <TData extends Record<string, unknown>>(
  props: DataGridProps<TData>,
) => {
  const {
    table,
    size = "screen-70",
    toolButtonSize,
    toolButtonVariant,
  } = props;
  const {
    customFilterOpen,
    hideShowOpen,
    density,
    densityOpen,
    exportOptions,
    exportOpen,
  } = table.getState();
  const colSpan = table
    .getHeaderGroups()
    .reduce((acc, headerGroup) => acc + headerGroup.headers.length, 0);
  const [cusotmFilterFields, setCustomFilterFields] = useState<Column<TData>[]>(
    [],
  );
  const localization = table.localization || LOCALIZATION_EN;
  const datagridClasses = datagrid({ size });
  const densitySmClasses = densityRecipe({ size: "sm" });
  const densityMdClasses = densityRecipe({ size: "md" });
  const densityLgClasses = densityRecipe({ size: "lg" });

  const tableDataClasses = cx(
    datagridClasses.tableData,
    density === "sm" && densitySmClasses,
    density === "md" && densityMdClasses,
    density === "lg" && densityLgClasses,
  );

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

  const calcColumnWidth = (cell: Cell<TData, unknown>): number => {
    return cell.column.id === "select"
      ? 20
      : table.enableSorting
        ? cell.column.getSize() + 48
        : cell.column.getSize() + 28;
  };

  const renderCell = useCallback((cell: Cell<TData, unknown>) => {
    if (
      cell.column.columnDef.meta &&
      cell.column.columnDef.meta.type === "enum"
    ) {
      const enumValues = cell.column.columnDef.meta.enumType;
      return enumValues?.[cell.getValue() as string] as ReactNode;
    } else {
      flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  }, []);

  return (
    <Stack gap={4} position={"relative"}>
      <HStack gap={4}>
        {table.enableHiding && (
          <HideShow
            allColumnsHandler={table.getToggleAllColumnsVisibilityHandler}
            columns={table.getAllLeafColumns()}
            localization={localization}
            hideShowOpen={hideShowOpen}
            setHideShowOpen={table.setHideShowOpen}
            size={toolButtonSize}
            variant={toolButtonVariant}
          />
        )}
        <CustomFilter
          columns={cusotmFilterFields}
          onChange={(filters) => {
            table.onFilterChange && table.onFilterChange(filters);
          }}
          localization={localization}
          systemFilter={table.systemFilter}
          defaultFilter={table.defaultFilter}
          customFilterOpen={customFilterOpen}
          setCustomFilterOpen={table.setCustomFilterOpen}
          enableColumnFilters={table.enableColumnFilters}
          size={toolButtonSize}
          variant={toolButtonVariant}
        />
        {table.enableDensity && (
          <Density
            setDensity={table.setDensity}
            localization={localization}
            densityOpen={densityOpen}
            setDensityOpen={table.setDensityOpen}
            size={toolButtonSize}
            variant={toolButtonVariant}
          />
        )}
        {table.getEnableExport() && (
          <Export
            exportOptions={exportOptions}
            localization={localization}
            exportCsv={table.exportCsv}
            exportOpen={exportOpen}
            setExportOpen={table.setExportOpen}
            size={toolButtonSize}
            variant={toolButtonVariant}
          />
        )}
      </HStack>
      <styled.div className={datagridClasses.wrapper}>
        <Table className={datagridClasses.table} overflow={"visible"}>
          <TableHeader className={datagridClasses.tableHeader}>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <TableRow className={datagridClasses.tableRow} key={i}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={i}
                    header={header as Header<Record<string, unknown>, unknown>}
                    table={table}
                    size={size}
                    localization={localization}
                  />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={datagridClasses.tableBody}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  className={datagridClasses.tableRow}
                  key={i}
                  data-state={row.getIsSelected() && "selected"}
                  data-testid={`datagrid-row`}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={i}
                      className={tableDataClasses}
                      style={{
                        ...getCommonPinningStyles(cell.column),
                      }}
                    >
                      <span
                        className={datagridClasses.tableDataText}
                        style={{
                          width: calcColumnWidth(cell),
                        }}
                      >
                        {renderCell(cell)}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className={tableDataClasses} colSpan={colSpan}>
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
