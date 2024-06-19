import { useRef } from "react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { DownloadIcon } from "lucide-react";
import {
  InitialTableState,
  Table,
  TableFeature,
  makeStateUpdater,
} from "@tanstack/react-table";
import { Box } from "@components/patterns/Box";
import { HStack } from "@components/patterns/HStack";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { LOCALIZATION_EN } from "@locales";
import { useGetBoxPosition } from "../useGetBoxPosition";
import { addEventOutside } from "../addEventOutside";
import type { ExportOptions, ExportProps, ExportTableState } from "./types";

export const Export = <TData extends Record<string, unknown>>(
  props: ExportProps<TData>,
) => {
  const exportCsv = props.table.exportCsv;
  const setExportOpen = props.table.setExportOpen;
  const { exportOptions, exportOpen } = props.table.getState();
  const localization = props.table.localization || LOCALIZATION_EN;
  const { size = "md", variant = "secondary" } = props;
  const exportRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const getBoxPosition = useGetBoxPosition(exportButtonRef);

  if (!props.table.getEnableExport()) {
    return null;
  }

  return (
    <>
      <HStack>
        <Button
          key="exportButton"
          variant={variant}
          size={size}
          onClick={() => {
            setExportOpen(!exportOpen);
            addEventOutside(
              exportRef,
              () => setExportOpen(false),
              exportButtonRef,
              false,
            );
          }}
          ref={exportButtonRef}
          data-testid="datagrid-export-button"
        >
          <DownloadIcon width={20} height={20} />
          <Text marginLeft={2}>{localization.export.exportLabel}</Text>
        </Button>
      </HStack>
      <Box
        p={4}
        w={"xs"}
        borderRadius={"4px"}
        boxShadow="lg"
        backgroundColor={"bg.default"}
        ref={exportRef}
        display={exportOpen ? "block" : "none"}
        style={{
          ...getBoxPosition(),
        }}
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
    </>
  );
};
Export.displayName = "Export";

type VisibleColumnRow = {
  [key: string]: unknown;
};

export const defaultExportOptions = {
  enableCsvExport: false,
  omit: undefined,
};

export const ExportFeature: TableFeature = {
  getInitialState: <TData extends Record<string, string>>(
    state: InitialTableState | undefined,
  ): ExportTableState<TData> => {
    return {
      exportOptions: defaultExportOptions,
      exportOpen: false,
      ...state,
    };
  },
  getDefaultOptions: <
    TData extends Record<string, string>,
  >(): ExportOptions<TData> => {
    return {
      exportOptions: defaultExportOptions,
    } as ExportOptions<TData>;
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
      const omit = table.getState().exportOptions?.omit;
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
          if (omit?.includes(column.id)) return;
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
