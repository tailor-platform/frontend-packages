import {
  RowData,
  Table,
  TableFeature,
  makeStateUpdater,
} from "@tanstack/react-table";
import { FilterIcon } from "lucide-react";
import { addEventOutside } from "../addEventOutside";
import { Box } from "../../../patterns/Box";
import { Button } from "../../../Button";
import type {
  CustomFilterOptions,
  CustomFilterProps,
  CustomFilterTableState,
} from "./types";
import { FilterRow } from "./FilterRow";
import { useCustomFilter } from "./useCustomFilter";
import { HStack } from "@components/patterns/HStack";
import { Text } from "@components/Text";

export const CustomFilter = <TData extends Record<string, unknown>>(
  props: CustomFilterProps<TData>,
) => {
  const {
    columns,
    onChange,
    localization,
    systemFilter,
    defaultFilter,
    customFilterOpen,
    setCustomFilterOpen,
    enableColumnFilters,
    size = "md",
    variant = "secondary",
  } = props;

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
    getBoxPosition,
  } = useCustomFilter({
    columns,
    onChange,
    systemFilter,
    defaultFilter,
  });

  if (!enableColumnFilters) {
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
        <Box
          flex={1}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
        >
          {filterRows.map((row, i) => {
            return (
              <FilterRow
                key={"filterRow" + i}
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
