import {
  Pagination as ArkPagination,
  type PaginationRootProps as ArkPaginationProps,
} from "@ark-ui/react";
import {
  pagination,
  type PaginationVariantProps,
} from "@tailor-platform/styled-system/recipes";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

export type PaginationProps = PaginationVariantProps & ArkPaginationProps;

export const Pagination = (props: PaginationProps) => {
  const { count, ...rest } = props;
  const classes = pagination();
  return (
    <ArkPagination.Root count={count} className={classes.root} {...rest}>
      {({ pages }) => (
        <>
          <ArkPagination.PrevTrigger asChild>
            <IconButton variant="tertiary" aria-label="Next Page">
              <ChevronLeftIcon />
            </IconButton>
          </ArkPagination.PrevTrigger>

          {pages.map((page, index) =>
            page.type === "page" ? (
              <ArkPagination.Item
                className={classes.item}
                key={index}
                {...page}
                asChild
              >
                <Button variant="secondary">{page.value}</Button>
              </ArkPagination.Item>
            ) : (
              <ArkPagination.Ellipsis
                className={classes.ellipsis}
                key={index}
                index={index}
              >
                &#8230;
              </ArkPagination.Ellipsis>
            ),
          )}
          <ArkPagination.NextTrigger asChild>
            <IconButton variant="tertiary" aria-label="Next Page">
              <ChevronRightIcon />
            </IconButton>
          </ArkPagination.NextTrigger>
        </>
      )}
    </ArkPagination.Root>
  );
};

Pagination.displayName = "Pagination";
