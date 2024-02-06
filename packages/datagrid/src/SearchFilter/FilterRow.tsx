import { Select as AS, Portal } from "@ark-ui/react";
import { IconButton, Input, Text } from "@tailor-platform/design-systems";
import { cx } from "@tailor-platform/styled-system/css";
import { Box, Flex, styled } from "@tailor-platform/styled-system/jsx";
import { select } from "@tailor-platform/styled-system/recipes";
import { ApplicableType, Column, FilterRowProps, JointCondition } from "@types";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import {
  ComponentType,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
} from "react";
import { getLocalizedFilterConditions } from "../data/filter";

const classes = select();

function withClass<
  T extends {
    children?: ReactNode;
    className?: string;
    items?: JointCondition[] | Column<T>[] | string[];
    item?: JointCondition | Column<T> | string;
    id?: string;
    placeholder?: string;
    fontWeight?: string;
    color?: string;
    positioning?: {sameWidth: boolean};
    closeOnSelect?: boolean;
    width?: number;
    onValueChange?: (e: any) => void;
  },
>(
// function withClass<T extends { className?: string }>(
  Comp: ComponentType<T>,
  additionalClassName: string,
) {
  const WithClassComp = forwardRef<unknown, T>((props, ref) => {
    const { className, ...rest } = props;
    const ClassNames = cx(className, additionalClassName);
    return <Comp ref={ref} {...(rest as T)} className={ClassNames} />;
  });
  WithClassComp.displayName = Comp.displayName;
  return WithClassComp;
}

const Select = {
  Root: withClass(styled(AS.Root), classes.root),
  ClearTrigger: withClass(styled(AS.ClearTrigger), classes.clearTrigger),
  Content: withClass(styled(AS.Content), classes.content),
  Control: withClass(styled(AS.Control), classes.control),
  Item: withClass(styled(AS.Item), classes.item),
  ItemGroup: withClass(styled(AS.ItemGroup), classes.itemGroup),
  ItemGroupLabel: withClass(styled(AS.ItemGroupLabel), classes.itemGroupLabel),
  ItemIndicator: withClass(styled(AS.ItemIndicator), classes.itemIndicator),
  ItemText: withClass(styled(AS.ItemText), classes.itemText),
  Label: withClass(styled(AS.Label), classes.label),
  Positioner: withClass(styled(AS.Positioner), classes.positioner),
  Trigger: withClass(styled(AS.Trigger), classes.trigger),
  ValueText: withClass(styled(AS.ValueText), classes.valueText),
};

export const FilterRow = <TData extends Record<string, unknown>>(
  props: FilterRowProps<TData>,
) => {
  const {
    columns,
    onDelete,
    onChange,
    localization,
    isFirstRow,
    jointConditions,
    currentFilter,
  } = props;

  const DATE_INPUT_PLACEHOLDER = "YYYY-MM-DD";
  const filterConditions = getLocalizedFilterConditions(localization);
  const selectedColumnObject = columns.find((column) => {
    return column.meta?.accessorKey === currentFilter.column;
  });

  const onChangeColumn = useCallback(
    (value: string[]) => {
      const column = columns.find((column) => column.label === value[0]);
      const nextFilter = {
        ...currentFilter,
        column: column?.meta?.accessorKey || "",
        condition: "",
        value: "",
      };
      onChange(nextFilter);
    },
    [onChange, currentFilter, columns],
  );

  const onChangeCondition = useCallback(
    (value: string[]) => {
      const nextFilter = {
        ...currentFilter,
        condition: value[0] || "",
      };
      onChange(nextFilter);
    },
    [onChange, currentFilter],
  );

  const onChangeValue = useCallback(
    (value: string[] | string) => {
      const nextFilter = {
        ...currentFilter,
        value:
          selectedColumnObject?.meta?.type === "enum" ||
          selectedColumnObject?.meta?.type === "boolean"
            ? (value[0] as string)
            : (value as string),
      };
      onChange(nextFilter);
    },
    [onChange, currentFilter, selectedColumnObject],
  );

  const onChangeJointCondition = useCallback(
    (value: string[]) => {
      const nextFilter = {
        ...currentFilter,
        jointCondition: value[0] || "",
      };
      onChange(nextFilter);
    },
    [onChange, currentFilter],
  );

  const enumList = useMemo(() => {
    return Object.keys(selectedColumnObject?.meta?.enumType || {});
  }, [selectedColumnObject]);

  const filteredFilterConditions = useMemo(() => {
    const selectedColumnType = selectedColumnObject?.meta
      ?.type as ApplicableType;
    if (!selectedColumnType) {
      return filterConditions;
    }
    return filterConditions.filter((condition) => {
      return condition.applicableTypeTypes.includes(selectedColumnType);
    });
  }, [filterConditions, selectedColumnObject]);

  const inputValuePlaceHolder = useMemo(() => {
    if (selectedColumnObject?.meta?.type === "date") {
      return DATE_INPUT_PLACEHOLDER;
    } else if (
      selectedColumnObject?.meta?.type === "enum" ||
      selectedColumnObject?.meta?.type === "boolean"
    ) {
      return localization.filter.valuePlaceholderEnum;
    }
    return localization.filter.valuePlaceholder;
  }, [localization, selectedColumnObject]);

  return (
    <Flex gridGap={2} marginTop={isFirstRow ? 0 : 4}>
      <IconButton
        variant="tertiary"
        size="md"
        color="fg.default"
        aria-label="Delete filter"
        icon={<X />}
        onClick={onDelete}
        alignSelf={"center"}
        visibility={isFirstRow ? "hidden" : "visible"}
        data-testid="delete-filter-row"
      />
      <Select.Root
        items={jointConditions}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e) => {
          onChangeJointCondition(e.value);
        }}
        value={
          currentFilter.jointCondition ? [currentFilter.jointCondition] : []
        }
        data-testid="select-joint-condition"
        width={180}
        visibility={isFirstRow ? "hidden" : "visible"}
      >
        <Select.Label fontWeight="bold">
          {localization.filter.jointConditionLabel}
        </Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              color="fg.subtle"
              placeholder={localization.filter.jointConditionPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.ItemGroup
                id="jointConditions"
                data-testid="select-joint-condition-options"
              >
                {jointConditions.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Select.Root
        items={columns}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e) => onChangeColumn(e.value)}
        value={selectedColumnObject ? [selectedColumnObject.value] : []}
        width={180}
        data-testid="select-column"
      >
        <Select.Label fontWeight="bold" color="fg.default">
          {localization.filter.columnLabel}
        </Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              color="fg.subtle"
              placeholder={localization.filter.columnPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content data-testid="select-column-options">
              <Select.ItemGroup id="column">
                {columns.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Select.Root
        items={filteredFilterConditions}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e) => onChangeCondition(e.value)}
        value={[currentFilter.condition]}
        width={180}
        data-testid="select-condition"
      >
        <Select.Label fontWeight="bold" color="fg.default">
          {localization.filter.condition.conditionLabel}
        </Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              color="fg.subtle"
              placeholder={localization.filter.condition.conditionPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content data-testid="select-condition-options">
              <Select.ItemGroup id="condition">
                {filteredFilterConditions.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Box>
        <Text fontWeight="bold" marginBottom={"4px"} color="fg.default">
          {localization.filter.valueLabel}
        </Text>
        {selectedColumnObject?.meta?.type === "enum" ? (
          <Select.Root
            items={enumList}
            positioning={{ sameWidth: true }}
            closeOnSelect
            width={180}
            onValueChange={(e) => onChangeValue(e.value)}
            data-testid="select-input-value"
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  color="fg.subtle"
                  placeholder={inputValuePlaceHolder}
                />
                <ChevronDown />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content data-testid="select-input-value-options">
                  <Select.ItemGroup id="filterByValue">
                    {enumList.map((item) => (
                      <Select.Item key={item} item={item}>
                        <Select.ItemText>{item}</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        ) : selectedColumnObject?.meta?.type === "boolean" ? (
          <Select.Root
            items={["true", "false"]}
            positioning={{ sameWidth: true }}
            closeOnSelect
            width={180}
            onValueChange={(e) => onChangeValue(e.value)}
            data-testid="select-input-value"
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  color="fg.subtle"
                  placeholder={inputValuePlaceHolder}
                />
                <ChevronDown />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.ItemGroup id="filterByValue">
                    <Select.Item key={0} item={"true"}>
                      <Select.ItemText>{"true"}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item key={1} item={"false"}>
                      <Select.ItemText>{"false"}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        ) : (
          <Box>
            <Input
              id="filterByValue"
              data-testid="select-input-value"
              size="md"
              width={180}
              borderRadius={"4px"}
              variant="outline"
              placeholder={inputValuePlaceHolder}
              onChange={(e) => {
                onChangeValue(e.target.value);
              }}
              value={[currentFilter.value]}
              type={selectedColumnObject?.meta?.type || "text"} //This input element is used for date, number and text type (for enum and boolean, we use select element above instead)
              maxLength={50}
            />
          </Box>
        )}
      </Box>
    </Flex>
  );
};
