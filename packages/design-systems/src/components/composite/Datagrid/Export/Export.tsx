import { ForwardedRef, forwardRef } from "react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Table, TableFeature, makeStateUpdater } from "@tanstack/react-table";
import { ExportOptions, ExportProps, ExportTableState } from "../types";
import { Box } from "@components/patterns/Box";
import { Button } from "@components/Button";

export const Export = forwardRef(
  (props: ExportProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { exportOptions, localization, isVisible, exportCsv } = props;

    if (!exportOptions) {
      return null;
    }
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
        {exportOptions?.enableCsvExport && (
          <Button
            variant="link"
            size="md"
            mb={2}
            onClick={() => {
              exportCsv();
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
  getDefaultOptions: (): ExportOptions => {
    return {
      enableCsvExport: true,
    } as ExportOptions;
  },

  createTable: <TData extends Record<string, unknown>>(
    table: Table<TData>,
  ): void => {
    table.setExportOpen = makeStateUpdater("exportOpen", table);
    table.getEnableExport = () => {
      const exportOptions = table.getState().exportOptions;
      if (exportOptions.enableCsvExport) {
        return true;
      }
      return false;
    };
    table.exportCsv = () => {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        filename: "sample", // export file name (without .csv)
        decimalSeparator: ".",
        useKeysAsHeaders: true,
      });
      const rows = table.getFilteredRowModel().rows;
      const columns = table.getVisibleLeafColumns();
      const rowData = rows.map((row) => {
        const original = row.original;
        const visibleColumnRow: VisibleColumnRow = {};
        columns.forEach((column) => {
          const header = (column.columnDef?.header as string) || column.id;
          if ("accessorKey" in column.columnDef) {
            visibleColumnRow[header] = original[column.columnDef.accessorKey];
          } else {
            visibleColumnRow[header] = original[column.id];
          }
        });
        return visibleColumnRow;
      });
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    };
  },
};
