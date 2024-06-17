import { useRef } from "react";
import {
  RowData,
  Table,
  TableFeature,
  Updater,
  functionalUpdate,
  makeStateUpdater,
} from "@tanstack/react-table";
import { RowsIcon } from "lucide-react";
import { addEventOutside } from "../addEventOutside";
import { useGetBoxPosition } from "../useGetBoxPosition";
import type {
  DensityOptions,
  DensityState,
  DensityTableState,
  DensityProps,
} from "./types";
import {
  RadioGroup,
  type RadioGroupOption,
} from "@components/composite/RadioGroup";
import { Box } from "@components/patterns/Box";
import { HStack } from "@components/patterns/HStack";
import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { LOCALIZATION_EN } from "@locales";

export const Density = <TData extends Record<string, unknown>>(
  props: DensityProps<TData>,
) => {
  const localization = props.table.localization || LOCALIZATION_EN;
  const { size = "md", variant = "secondary" } = props;
  const { densityOpen } = props.table.getState();
  const setDensityOpen = props.table.setDensityOpen;
  const setDensity = props.table.setDensity;

  const densityRef = useRef<HTMLDivElement>(null);
  const densityButtonRef = useRef<HTMLButtonElement>(null);
  const options: RadioGroupOption[] = [
    {
      label: localization.density.compact,
      value: "sm",
    },
    {
      label: localization.density.standard,
      value: "md",
    },
    {
      label: localization.density.comfortable,
      value: "lg",
    },
  ];

  const getBoxPosition = useGetBoxPosition(densityButtonRef);

  if (!props.table.enableDensity) {
    return null;
  }

  return (
    <>
      <HStack>
        <Button
          key="densityButton"
          variant={variant}
          size={size}
          onClick={() => {
            setDensityOpen(!densityOpen);
            addEventOutside(
              densityRef,
              () => setDensityOpen(false),
              densityButtonRef,
            );
          }}
          ref={densityButtonRef}
          data-testid="datagrid-density-button"
        >
          <RowsIcon width={20} height={20} />
          <Text marginLeft={2}>{localization.density.densityLabel}</Text>
        </Button>
      </HStack>
      <Box
        p={4}
        w={"xs"}
        borderRadius={"4px"}
        boxShadow="lg"
        backgroundColor={"bg.default"}
        ref={densityRef}
        display={densityOpen ? "block" : "none"}
        style={{
          ...getBoxPosition(),
        }}
      >
        <RadioGroup
          options={options}
          defaultValue="md"
          onValueChange={(details) => setDensity(details.value as DensityState)}
        />
      </Box>
    </>
  );
};

Density.displayName = "Density";

export const DensityFeature: TableFeature = {
  getInitialState: (state): DensityTableState => {
    return {
      density: "md",
      densityOpen: false,
      ...state,
    };
  },
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>,
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater("density", table),
    } as DensityOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        const newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onDensityChange?.(safeUpdater);
    };
    table.setDensityOpen = makeStateUpdater("densityOpen", table);
  },
};
