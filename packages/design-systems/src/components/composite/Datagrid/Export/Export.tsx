import { ForwardedRef, forwardRef } from "react";
import { ExportOptions, ExportProps, ExportTableState } from "../types";
import { Box } from "@components/patterns/Box";
import { Button } from "../../../Button";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Column, Row, RowData, Table, TableFeature, makeStateUpdater } from "@tanstack/react-table";

export const Export = forwardRef(
  <TData extends Record<string, unknown>>(
    props: ExportProps<TData>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { rows, columns, exportOptions, localization, isVisible } = props;

    if (!exportOptions) {
      return null;
    }

    const csvConfig = mkConfig({
      fieldSeparator: ",",
      filename: "sample", // export file name (without .csv)
      decimalSeparator: ".",
      useKeysAsHeaders: true,
    });

    const exportCsv = (rows: Row<TData>[]) => {
      const rowData = rows.map((row) => {
        const original = row.original;
        let visibleColumnRow: VisibleColumnRow = {};
        columns.forEach((column) => {
          if ("accessorKey" in column.columnDef) {
            visibleColumnRow[column.columnDef.accessorKey as string] =
              original[column.columnDef.accessorKey];
          } else {
            visibleColumnRow[column.id] = original[column.id];
          }
        });
        return visibleColumnRow;
      });
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    };

    return (
      <Box
        p={4}
        w={"xs"}
        borderRadius={"4px"}
        boxShadow="lg"
        position={"absolute"}
        top={"100px"}
        backgroundColor={"bg.default"}
        zIndex={2}
        ref={ref}
        display={isVisible ? "block" : "none"}
      >
        {exportOptions.enableCsvExport && (
          <Button
            variant="link"
            size="md"
            mb={2}
            onClick={() => {
              exportCsv(rows);
            }}
          >
            {localization.export.exportCSV}
          </Button>
        )}
      </Box>
    );
  },
);

Export.displayName = "Export";

type VisibleColumnRow = {
  [key: string]: unknown;
};


export const ExportFeature: TableFeature = {
  getInitialState: (state): ExportTableState => {
    return {
      exportOptions: {
        enableCsvExport: true,
      },
      exportOpen: false,
      ...state,
    };
  },
  getDefaultOptions: 
  // <TData extends RowData>
  (
    // table: Table<TData>,
  ): ExportOptions => {
    return {
      enableCsvExport: true,
    } as ExportOptions;
  },

  createTable: <TData extends Record<string, unknown>>(table: Table<TData>): void => {
    table.setExportOpen = makeStateUpdater("exportOpen", table);
    table.getEnableExport = () => {
      const exportOptions = table.getState().exportOptions
      if(exportOptions.enableCsvExport) {
        return true
      }
      return false
    };
    table.exportCsv = (rows: Row<TData>[], columns: Column<TData, unknown>[]) => {
        const csvConfig = mkConfig({
          fieldSeparator: ",",
          filename: "sample", // export file name (without .csv)
          decimalSeparator: ".",
          useKeysAsHeaders: true,
        });
      const rowData = rows.map((row) => {
        const original = row.original;
        let visibleColumnRow: VisibleColumnRow = {};
        columns.forEach((column) => {
          if ("accessorKey" in column.columnDef) {
            visibleColumnRow[column.columnDef.accessorKey as string] =
              original[column.columnDef.accessorKey];
          } else {
            visibleColumnRow[column.id] = original[column.id];
          }
        });
        return visibleColumnRow;
      });
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    }
  };
}