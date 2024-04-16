import { ForwardedRef, forwardRef } from "react";
import {
  RowData,
  Table,
  TableFeature,
  Updater,
  functionalUpdate,
  makeStateUpdater,
} from "@tanstack/react-table";
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

export const Density = forwardRef(
  (props: DensityProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { setDensity, localization, isVisible } = props;
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
        <RadioGroup
          options={options}
          defaultValue="md"
          onValueChange={(details) => setDensity(details.value as DensityState)}
        />
      </Box>
    );
  },
);

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
