import {
  RowData,
  Table,
  TableFeature,
  makeStateUpdater,
} from "@tanstack/react-table";
import { FilterIcon } from "lucide-react";
import { HStack } from "@components/patterns/HStack";
import { Text } from "@components/Text";
import { LOCALIZATION_EN } from "@locales";
import { Badge } from "@components/Badge";
import { addEventOutside } from "../addEventOutside";
import { Box } from "../../../patterns/Box";
import { Button } from "../../../Button";
import { useGetBoxPosition } from "../useGetBoxPosition";
import type {
  CustomFilterOptions,
  CustomFilterProps,
  CustomFilterTableState,
  GraphQLQueryFilter,
} from "./types";
import { FilterRow } from "./FilterRow";
import { useCustomFilter } from "./useCustomFilter";

export const CustomFilter = <TData extends Record<string, unknown>>(
  props: CustomFilterProps<TData>,
) => {
  const localization = props.table.localization || LOCALIZATION_EN;
  const { columns, size = "md", variant = "secondary" } = props;
  const onChange = (filters: GraphQLQueryFilter | undefined) => {
    props.table.onFilterChange?.(filters);
  };
  const systemFilter = props.table.systemFilter;
  const defaultFilter = props.table.defaultFilter;
  const { customFilterOpen } = props.table.getState();
  const setCustomFilterOpen = props.table.setCustomFilterOpen;
  const {
    filterRef,
    filterButtonRef,
    filterRows,
    activeJointConditions,
    deleteFilterRowHandler,
    resetFilterHandler,
    clearFilterHandler,
    addNewFilterRowHandler,
    filterChangedHandler,
    applyFilterHandler,
    numberOfSearchConditions,
  } = useCustomFilter({
    columns,
    onChange,
    systemFilter,
    defaultFilter,
  });

  const getBoxPosition = useGetBoxPosition(filterButtonRef);

  if (!props.table.enableColumnFilters) {
    return null;
  }

  return (
    <>
      <HStack>
        <Button
          key="filterButton"
          variant={variant}
          size={size}
          onClick={() => {
            setCustomFilterOpen(!customFilterOpen);
            addEventOutside(
              filterRef,
              () => setCustomFilterOpen(false),
              filterButtonRef,
              true,
            );
          }}
          ref={filterButtonRef}
          data-testid="datagrid-filter-button"
        >
          <Badge
            variant="info"
            style={{
              zIndex: 2,
              position: "absolute",
              top: -6,
              left: -4,
              visibility: numberOfSearchConditions !== 0 ? "visible" : "hidden",
            }}
            data-testid="filter-badge"
          >
            {numberOfSearchConditions}
          </Badge>
          <FilterIcon width={20} height={20} />
          <Text marginLeft={2}>{localization.filter.filterLabel}</Text>
        </Button>
      </HStack>
      <Box
        px={4}
        pb={4}
        borderRadius={"4px"}
        boxShadow="lg"
        backgroundColor={"bg.default"}
        ref={filterRef}
        display={customFilterOpen ? "block" : "none"}
        style={{
          ...getBoxPosition(),
        }}
      >
        <Button
          variant="tertiary"
          onClick={resetFilterHandler}
          color={"error.default"}
          data-testid={"reset-filter-button"}
        >
          {localization.filter.filterResetLabel}
        </Button>
        {!!defaultFilter && (
          <Button
            variant="tertiary"
            onClick={clearFilterHandler}
            color={"error.default"}
            data-testid={"reset-clear-button"}
          >
            {localization.filter.filterClearLabel}
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={applyFilterHandler}
          data-testid={"filter-apply-button"}
          style={{ float: "right", marginTop: "16px" }}
        >
          {localization.filter.filterApplyLabel}
        </Button>
        <Box
          flex={1}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
          style={{
            marginTop: "24px",
          }}
        >
          {filterRows.map((row, i) => {
            return (
              <FilterRow
                key={i}
                currentFilter={row.currentState}
                columns={columns}
                jointConditions={activeJointConditions}
                onDelete={deleteFilterRowHandler(row.index)}
                index={i}
                onChange={filterChangedHandler(row.index)}
                localization={localization}
              />
            );
          })}
        </Box>
        <Button
          backgroundColor="primary.default"
          marginTop={4}
          onClick={() => {
            addNewFilterRowHandler();
          }}
        >
          {localization.filter.addNewFilterLabel}
        </Button>
      </Box>
    </>
  );
};

CustomFilter.displayName = "CustomFilter";

export const CustomFilterFeature: TableFeature = {
  getInitialState: (state): CustomFilterTableState => {
    return {
      customFilterOpen: false,
      ...state,
    };
  },
  getDefaultOptions: (): CustomFilterOptions => {
    return {
      enableCustomFilter: true,
    } as CustomFilterOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setCustomFilterOpen = makeStateUpdater("customFilterOpen", table);
  },
};
