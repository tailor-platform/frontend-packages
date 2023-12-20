import {
  Box,
  type HTMLStyledProps,
  styled,
} from "@tailor-platform/styled-system/jsx";
import { cx } from "@tailor-platform/styled-system/css";
import { table } from "@tailor-platform/styled-system/recipes";

const classes = table();

type TableProps = HTMLStyledProps<"table">;
const Table = (props: TableProps) => {
  const { className, ...rest } = props;
  return (
    <Box w="full" overflow="auto">
      <styled.table
        className={cx("group", classes.table, className)}
        {...rest}
      />
    </Box>
  );
};

type TableHeaderProps = HTMLStyledProps<"thead">;
const TableHeader = (props: TableHeaderProps) => {
  const { className, ...rest } = props;
  return (
    <styled.thead className={cx("group", classes.thead, className)} {...rest} />
  );
};
TableHeader.displayName = "TableHeader";

type TableBodyProps = HTMLStyledProps<"tbody">;
const TableBody = (props: TableBodyProps) => {
  const { className, ...rest } = props;
  return (
    <styled.tbody className={cx("group", classes.tbody, className)} {...rest} />
  );
};

TableBody.displayName = "TableBody";

type TableFooterProps = HTMLStyledProps<"tfoot">;
const TableFooter = (props: TableFooterProps) => {
  const { className, ...rest } = props;
  return (
    <styled.tfoot className={cx("group", classes.tfoot, className)} {...rest} />
  );
};

TableFooter.displayName = "TableFooter";

type TableRowProps = HTMLStyledProps<"tr">;
const TableRow = (props: TableRowProps) => {
  const { className, ...rest } = props;
  return <styled.tr className={cx("group", classes.tr, className)} {...rest} />;
};

TableRow.displayName = "TableRow";

type TableHeadProps = HTMLStyledProps<"th">;
const TableHead = (props: TableHeadProps) => {
  const { className, ...rest } = props;
  return <styled.th className={cx("group", classes.th, className)} {...rest} />;
};

TableHead.displayName = "TableHead";

type TableCellProps = HTMLStyledProps<"td">;
const TableCell = (props: TableCellProps) => {
  const { className, ...rest } = props;
  return <styled.td className={cx("group", classes.td, className)} {...rest} />;
};

TableCell.displayName = "TableCell";

type TableCaptionProps = HTMLStyledProps<"caption">;
const TableCaption = (props: TableCaptionProps) => {
  const { className, ...rest } = props;
  return (
    <styled.caption
      className={cx("group", classes.caption, className)}
      {...rest}
    />
  );
};

TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableBodyProps,
  type TableCaptionProps,
  type TableCellProps,
  type TableFooterProps,
  type TableHeadProps,
  type TableHeaderProps,
  type TableProps,
  type TableRowProps,
};
