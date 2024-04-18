import { ForwardedRef, forwardRef, useRef } from "react";
import {
  RowData,
  Table,
  TableFeature,
  Updater,
  functionalUpdate,
  makeStateUpdater,
} from "@tanstack/react-table";
import { RowsIcon } from "lucide-react";
import {
  DensityOptions,
  DensityState,
  DensityTableState,
  DensityProps,
} from "../types";
import {
  RadioGroup,
  type RadioGroupOption,
} from "@components/composite/RadioGroup";
import { Box } from "@components/patterns/Box";
import { useClickOutside } from "../hooks/useClickOutside";
import { HStack } from "@components/patterns/HStack";
import { Button } from "@components/Button";
import { Text } from "@components/Text";

export const Density = (props: DensityProps) => {
  const { setDensity, localization, densityOpen, setDensityOpen } = props;

  const densityRef = useRef<HTMLDivElement>(null);
  const densityButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(densityRef, () => setDensityOpen(false), densityButtonRef);
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
  return (
    <>
      <HStack>
        <Button
          key="densityButton"
          variant="secondary"
          size="md"
          onClick={() => {
            setDensityOpen(!densityOpen);
          }}
          ref={densityButtonRef}
          data-testid="datagrid-density-button"
        >
          <RowsIcon />
          <Text marginLeft={2}>{localization.density.densityLabel}</Text>
        </Button>
      </HStack>
      <Box
        p={4}
        w={"xs"}
        borderRadius={"4px"}
        boxShadow="lg"
        position={"absolute"}
        top={"100px"}
        backgroundColor={"bg.default"}
        zIndex={2}
        ref={densityRef}
        display={densityOpen ? "block" : "none"}
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
