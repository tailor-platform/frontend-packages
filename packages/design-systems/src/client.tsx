/**
 * Client-side components for the design system.
 *
 * @module client
 * @packageDocumentation
 */
export { Code, type CodeProps } from "@/components/Code";
export { Form } from "@/components/Form";
export {
  DataGrid,
  type DataGridInstance,
  type UseDataGridProps,
  type Localization,
  type GraphQLQueryFilter,
  useDataGrid,
} from "@components/composite/Datagrid";
export {
  DatePicker,
  type DatePickerProps,
} from "@/components/composite/DatePicker";
export * from "@tanstack/react-table";
