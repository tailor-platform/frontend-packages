import { Pagination, type PaginationRootProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button, IconButton } from "@tailor-platform/design-systems";
import { pagination } from "@tailor-platform/styled-system/recipes";
import { paginationTypes } from "../../ark-types";

Pagination.Root.displayName = "Pagination";

const classes = pagination();

const meta = {
  title: "Composite/Pagination",
  component: Pagination.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...paginationTypes },
} satisfies Meta<PaginationRootProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 5000,
    pageSize: 10,
    siblingCount: 2,
    children: null,
  },
  render: () => (
    <Pagination.Root
      count={50}
      pageSize={10}
      siblingCount={1}
      defaultPage={2}
      className={classes.root}
    >
      {({ pages }) => (
        <>
          <Pagination.PrevTrigger asChild>
            <IconButton variant="tertiary" aria-label="Next Page">
              <ChevronLeftIcon />
            </IconButton>
          </Pagination.PrevTrigger>

          {pages.map((page, index) =>
            page.type === "page" ? (
              <Pagination.Item
                className={classes.item}
                key={index}
                {...page}
                asChild
              >
                <Button variant="secondary">{page.value}</Button>
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
            <IconButton variant="tertiary" aria-label="Next Page">
              <ChevronRightIcon />
            </IconButton>
          </Pagination.NextTrigger>
        </>
      )}
    </Pagination.Root>
  ),
};
