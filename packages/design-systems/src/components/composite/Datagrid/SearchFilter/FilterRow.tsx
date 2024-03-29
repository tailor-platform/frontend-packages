import { useCallback, useMemo } from "react";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import { Select as AS, CollectionItem } from "@ark-ui/react/select";
import { Portal } from "@ark-ui/react/portal";
import { styled } from "@tailor-platform/styled-system/jsx";
import { select } from "@tailor-platform/styled-system/recipes";
import { Box } from "../../../patterns/Box";
import { Flex } from "../../../patterns/Flex";
import { IconButton } from "../../../IconButton";
import { Input } from "../../../Input";
import { Text } from "../../../Text";
import { getLocalizedFilterConditions } from "../data/filter";
import { ApplicableType, FilterRowProps } from "./../types";

interface ValueChangeDetails<T extends CollectionItem = CollectionItem> {
  value: string[];
  items: T[];
}

const Select = {
  Root: styled(AS.Root),
  ClearTrigger: styled(AS.ClearTrigger),
  Content: styled(AS.Content),
  Control: styled(AS.Control),
  Item: styled(AS.Item),
  ItemGroup: styled(AS.ItemGroup),
  ItemGroupLabel: styled(AS.ItemGroupLabel),
  ItemIndicator: styled(AS.ItemIndicator),
  ItemText: styled(AS.ItemText),
  Label: styled(AS.Label),
  Positioner: styled(AS.Positioner),
  Trigger: styled(AS.Trigger),
  ValueText: styled(AS.ValueText),
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

  const classes = select();

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
            ? value[0]
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
        className={classes.root}
        items={jointConditions}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e: ValueChangeDetails<CollectionItem>) => {
          onChangeJointCondition(e.value);
        }}
        value={
          currentFilter.jointCondition ? [currentFilter.jointCondition] : []
        }
        data-testid="select-joint-condition"
        width={180}
        visibility={isFirstRow ? "hidden" : "visible"}
      >
        <Select.Label className={classes.label} fontWeight="bold">
          {localization.filter.jointConditionLabel}
        </Select.Label>
        <Select.Control className={classes.control}>
          <Select.Trigger className={classes.trigger}>
            <Select.ValueText
              className={classes.valueText}
              color="fg.subtle"
              placeholder={localization.filter.jointConditionPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner className={classes.positioner}>
            <Select.Content className={classes.content}>
              <Select.ItemGroup
                className={classes.itemGroup}
                id="jointConditions"
                data-testid="select-joint-condition-options"
              >
                {jointConditions.map((item) => (
                  <Select.Item
                    className={classes.item}
                    key={item.value}
                    item={item}
                    data-testid={`joint-condition-${item.value}`}
                  >
                    <Select.ItemText className={classes.itemText}>
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className={classes.itemIndicator}>
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
        className={classes.root}
        items={columns}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e: ValueChangeDetails<CollectionItem>) =>
          onChangeColumn(e.value)
        }
        value={selectedColumnObject ? [selectedColumnObject.value] : []}
        width={180}
        data-testid="select-column"
      >
        <Select.Label
          className={classes.label}
          fontWeight="bold"
          color="fg.default"
        >
          {localization.filter.columnLabel}
        </Select.Label>
        <Select.Control className={classes.control}>
          <Select.Trigger className={classes.trigger}>
            <Select.ValueText
              className={classes.valueText}
              color="fg.subtle"
              placeholder={localization.filter.columnPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner className={classes.positioner}>
            <Select.Content
              className={classes.content}
              data-testid="select-column-options"
            >
              <Select.ItemGroup className={classes.itemGroup} id="column">
                {columns.map((item) => (
                  <Select.Item
                    className={classes.item}
                    key={item.value}
                    item={item}
                    data-testid={`filter-column-${item.value}`}
                  >
                    <Select.ItemText className={classes.itemText}>
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className={classes.itemIndicator}>
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
        className={classes.root}
        items={filteredFilterConditions}
        positioning={{ sameWidth: true }}
        closeOnSelect
        onValueChange={(e: ValueChangeDetails<CollectionItem>) =>
          onChangeCondition(e.value)
        }
        value={[currentFilter.condition]}
        width={180}
        data-testid="select-condition"
      >
        <Select.Label
          className={classes.label}
          fontWeight="bold"
          color="fg.default"
        >
          {localization.filter.condition.conditionLabel}
        </Select.Label>
        <Select.Control className={classes.control}>
          <Select.Trigger className={classes.trigger}>
            <Select.ValueText
              className={classes.valueText}
              color="fg.subtle"
              placeholder={localization.filter.condition.conditionPlaceholder}
            />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Positioner className={classes.positioner}>
            <Select.Content
              className={classes.content}
              data-testid="select-condition-options"
            >
              <Select.ItemGroup className={classes.itemGroup} id="condition">
                {filteredFilterConditions.map((item) => (
                  <Select.Item
                    className={classes.item}
                    key={item.value}
                    item={item}
                  >
                    <Select.ItemText className={classes.itemText}>
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className={classes.itemIndicator}>
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
            className={classes.root}
            items={enumList}
            positioning={{ sameWidth: true }}
            closeOnSelect
            width={180}
            onValueChange={(e: ValueChangeDetails<CollectionItem>) =>
              onChangeValue(e.value)
            }
            data-testid="select-input-value"
          >
            <Select.Control className={classes.control}>
              <Select.Trigger className={classes.trigger}>
                <Select.ValueText
                  className={classes.valueText}
                  color="fg.subtle"
                  placeholder={inputValuePlaceHolder}
                />
                <ChevronDown />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner className={classes.positioner}>
                <Select.Content
                  className={classes.content}
                  data-testid="select-input-value-options"
                >
                  <Select.ItemGroup
                    className={classes.itemGroup}
                    id="filterByValue"
                  >
                    {enumList.map((item) => (
                      <Select.Item
                        className={classes.item}
                        key={item}
                        item={item}
                      >
                        <Select.ItemText className={classes.itemText}>
                          {item}
                        </Select.ItemText>
                        <Select.ItemIndicator className={classes.itemIndicator}>
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
            className={classes.root}
            items={["true", "false"]}
            positioning={{ sameWidth: true }}
            closeOnSelect
            width={180}
            onValueChange={(e: ValueChangeDetails<CollectionItem>) =>
              onChangeValue(e.value)
            }
            data-testid="select-input-value"
          >
            <Select.Control className={classes.control}>
              <Select.Trigger className={classes.trigger}>
                <Select.ValueText
                  className={classes.valueText}
                  color="fg.subtle"
                  placeholder={inputValuePlaceHolder}
                />
                <ChevronDown />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner className={classes.positioner}>
                <Select.Content className={classes.content}>
                  <Select.ItemGroup
                    className={classes.itemGroup}
                    id="filterByValue"
                  >
                    <Select.Item className={classes.item} key={0} item={"true"}>
                      <Select.ItemText className={classes.itemText}>
                        {"true"}
                      </Select.ItemText>
                      <Select.ItemIndicator className={classes.itemIndicator}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item
                      className={classes.item}
                      key={1}
                      item={"false"}
                    >
                      <Select.ItemText className={classes.itemText}>
                        {"false"}
                      </Select.ItemText>
                      <Select.ItemIndicator className={classes.itemIndicator}>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
