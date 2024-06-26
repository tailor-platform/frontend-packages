import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckIcon, ChevronDown, X, XIcon } from "lucide-react";
import { Select as AS } from "@ark-ui/react";
import { CollectionItem } from "@ark-ui/react/dist/types";
import { styled } from "@tailor-platform/styled-system/jsx";
import { select, tagsInput } from "@tailor-platform/styled-system/recipes";
import { ColumnMeta } from "@tanstack/table-core";
import { TagsInput as BaseTagsInput } from "@ark-ui/react";
import { Button } from "@components/Button";
import type { Column } from "../types";
import { Box } from "../../../patterns/Box";
import { Flex } from "../../../patterns/Flex";
import { IconButton } from "../../../IconButton";
import { Input } from "../../../Input";
import { Text } from "../../../Text";
import type { Localization } from "..";
import { getLocalizedFilterConditions } from "./filter";
import type {
  ApplicableType,
  FilterRowState,
  JointCondition,
  ValueChangeDetails,
} from "./types";

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

type FilterRowProps<TData> = {
  columns: Array<Column<TData>>;
  onDelete: () => void;
  meta?: ColumnMeta<TData, unknown>;
  onChange: (currentState: FilterRowState) => void;
  localization: Localization;
  index: number;
  jointConditions: JointCondition[];
  currentFilter: FilterRowState;
};

export const FilterRow = <TData extends Record<string, unknown>>(
  props: FilterRowProps<TData>,
) => {
  const {
    columns,
    onDelete,
    onChange,
    localization,
    index,
    jointConditions,
    currentFilter,
  } = props;

  const classes = select();

  const [value, setValue] = useState<string[]>(
    currentFilter.value !== null && currentFilter.value !== undefined
      ? [currentFilter.value.toString()]
      : [],
  );

  useEffect(() => {
    if (currentFilter.value !== null && currentFilter.value !== undefined) {
      setValue([currentFilter.value.toString()]);
    }
  }, [currentFilter.value]);

  const DATE_INPUT_PLACEHOLDER = "YYYY-MM-DD";
  const filterConditions = getLocalizedFilterConditions(localization);
  const selectedColumnObject = columns.find((column) => {
    return column.accessorKey === currentFilter.column;
  });

  const onChangeColumn = useCallback(
    (value: string[]) => {
      const column = columns.find((column) => column.label === value[0]);
      const nextFilter = {
        ...currentFilter,
        column: column?.accessorKey || "",
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

  const valueConverter = useCallback(
    (value: string[] | string) => {
      if (
        selectedColumnObject?.meta?.type === "enum" ||
        selectedColumnObject?.meta?.type === "boolean"
      ) {
        return value[0];
      }

      return value;
    },
    [selectedColumnObject?.meta?.type],
  );

  const onChangeValue = useCallback(
    (value: string[] | string) => {
      const nextFilter = {
        ...currentFilter,
        value: valueConverter(value),
      };
      onChange(nextFilter);
    },
    [valueConverter, currentFilter, onChange],
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

  const inputType = useMemo(() => {
    if (selectedColumnObject?.meta?.type === "dateTime") {
      return "datetime-local";
    }
    return selectedColumnObject?.meta?.type || "text";
  }, [selectedColumnObject?.meta?.type]);

  const renderValueInput = () => {
    // render pattern
    if (currentFilter.condition === "in") {
      return (
        <TagsInput
          inputValuePlaceHolder={inputValuePlaceHolder}
          inputType={inputType}
          onChangeValue={onChangeValue}
        />
      );
    } else if (selectedColumnObject?.meta?.type === "enum") {
      return (
        <EnumSelect
          currentFilter={currentFilter}
          selectedColumnObject={selectedColumnObject}
          inputValuePlaceHolder={inputValuePlaceHolder}
          enumList={enumList}
          onChangeValue={onChangeValue}
        />
      );
    } else if (selectedColumnObject?.meta?.type === "boolean") {
      return (
        <BooleanSelect
          currentFilter={currentFilter}
          inputValuePlaceHolder={inputValuePlaceHolder}
          onChangeValue={onChangeValue}
          items={[
            {
              label: localization.filter.columnBoolean.true,
              value: "true",
            },
            {
              label: localization.filter.columnBoolean.false,
              value: "false",
            },
          ]}
        />
      );
    } else {
      return (
        <Box>
          <Input
            id="filterByValue"
            data-testid="select-input-value"
            size="md"
            width={180}
            borderRadius={"4px"}
            variant="outline"
            placeholder={inputValuePlaceHolder}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeValue(e.target.value);
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue([e.target.value]);
            }}
            value={value}
            type={inputType} //This input element is used for date, dateTime, number and text type (for enum and boolean, we use select element above instead)
            maxLength={50}
          />
        </Box>
      );
    }
  };

  const isFirstRow = useMemo(() => index === 0, [index]);

  return (
    <Flex gridGap={2} marginTop={isFirstRow ? 0 : 4} position="relative">
      <IconButton
        variant="tertiary"
        size="md"
        color="fg.default"
        aria-label="Delete filter"
        icon={<X />}
        onClick={onDelete}
        visibility={isFirstRow ? "hidden" : "visible"}
        data-testid="delete-filter-row"
        style={{ position: "relative", top: 25 }}
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
        disabled={!currentFilter.isChangeable}
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
        <Select.Positioner className={classes.positioner}>
          <Select.Content className={classes.content}>
            <Select.ItemGroup
              className={classes.itemGroup}
              id="jointConditions"
              data-testid="select-joint-condition-options"
            >
              {jointConditions.map((item, i) => (
                <Select.Item
                  className={classes.item}
                  key={i}
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
        <Select.Positioner className={classes.positioner}>
          <Select.Content
            className={classes.content}
            data-testid="select-column-options"
          >
            <Select.ItemGroup className={classes.itemGroup} id="column">
              {columns.map((item, i) => (
                <Select.Item
                  className={classes.item}
                  key={i}
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
        <Select.Positioner className={classes.positioner}>
          <Select.Content
            className={classes.content}
            data-testid="select-condition-options"
          >
            <Select.ItemGroup className={classes.itemGroup} id="condition">
              {filteredFilterConditions.map((item, i) => (
                <Select.Item className={classes.item} key={i} item={item}>
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
      </Select.Root>
      <Box>
        <Text fontWeight="bold" marginBottom={"4px"} color="fg.default">
          {localization.filter.valueLabel}
        </Text>
        {renderValueInput()}
      </Box>
    </Flex>
  );
};

type TagInputProps = {
  inputValuePlaceHolder: string;
  defaultValue?: string[];
  inputType: string;
  onChangeValue: (value: string[]) => void;
};

const TagsInput = ({
  inputValuePlaceHolder,
  defaultValue,
  inputType,
  onChangeValue,
}: TagInputProps) => {
  const classes = tagsInput();

  return (
    <>
      <BaseTagsInput.Root
        className={classes.root}
        defaultValue={defaultValue}
        style={{ width: 180 }}
        onValueChange={(e) => {
          onChangeValue(e.value);
        }}
      >
        <BaseTagsInput.Context>
          {({ value, setValue }) => (
            <>
              <BaseTagsInput.Control className={classes.control}>
                {value.map((v, index) => (
                  <BaseTagsInput.Item
                    className={classes.item}
                    key={index}
                    index={index}
                    value={v}
                  >
                    <BaseTagsInput.ItemText>{v}</BaseTagsInput.ItemText>
                    <BaseTagsInput.ItemDeleteTrigger
                      asChild
                      onClick={() => {
                        const newValue = value.filter((item) => item !== v);
                        setValue(newValue);
                        onChangeValue(newValue);
                      }}
                      data-testid={`delete-tag-${index}`}
                    >
                      <IconButton aria-label="close" variant="link" size="xs">
                        <XIcon />
                      </IconButton>
                    </BaseTagsInput.ItemDeleteTrigger>
                    <BaseTagsInput.ItemInput className={classes.itemInput} />
                  </BaseTagsInput.Item>
                ))}
                <BaseTagsInput.Input
                  className={classes.input}
                  placeholder={inputValuePlaceHolder}
                  type={inputType}
                  data-testid="tags-input-value"
                  style={{ width: 160 }}
                />
                <BaseTagsInput.ClearTrigger asChild data-testid="clear-tags">
                  <Button variant="secondary" size="sm">
                    Clear
                  </Button>
                </BaseTagsInput.ClearTrigger>
              </BaseTagsInput.Control>
            </>
          )}
        </BaseTagsInput.Context>
      </BaseTagsInput.Root>
    </>
  );
};

type EnumSelectProps<TData> = {
  currentFilter: FilterRowState;
  selectedColumnObject: Column<TData> | undefined;
  inputValuePlaceHolder: string;
  enumList: string[];
  onChangeValue: (value: string[]) => void;
};
const EnumSelect = <TData extends Record<string, unknown>>({
  enumList,
  currentFilter,
  onChangeValue,
  inputValuePlaceHolder,
  selectedColumnObject,
}: EnumSelectProps<TData>) => {
  if (currentFilter.value === null || currentFilter.value === undefined) {
    return;
  }

  const classes = select();
  return (
    <>
      <Select.Root
        className={classes.root}
        items={enumList}
        positioning={{ sameWidth: true }}
        closeOnSelect
        width={180}
        value={[currentFilter.value.toString()]}
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
              asChild
            >
              <span>
                {currentFilter.value !== ""
                  ? selectedColumnObject?.meta?.enumType?.[
                      currentFilter.value.toString()
                    ]
                  : inputValuePlaceHolder}
              </span>
            </Select.ValueText>
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner className={classes.positioner}>
          <Select.Content
            className={classes.content}
            data-testid="select-input-value-options"
          >
            <Select.ItemGroup className={classes.itemGroup} id="filterByValue">
              {enumList.map((item, i) => {
                const enumValue = selectedColumnObject?.meta?.enumType?.[item];
                return (
                  <Select.Item className={classes.item} key={i} item={item}>
                    <Select.ItemText className={classes.itemText}>
                      {enumValue}
                    </Select.ItemText>
                    <Select.ItemIndicator className={classes.itemIndicator}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </>
  );
};

type BooleanSelectProps = {
  currentFilter: FilterRowState;
  onChangeValue: (value: string[]) => void;
  inputValuePlaceHolder: string;
  items: { label: string; value: string }[];
};
const BooleanSelect = ({
  currentFilter,
  onChangeValue,
  inputValuePlaceHolder,
  items,
}: BooleanSelectProps) => {
  if (currentFilter.value === null || currentFilter.value === undefined) {
    return;
  }

  const classes = select();
  return (
    <>
      <Select.Root
        className={classes.root}
        items={items}
        positioning={{ sameWidth: true }}
        closeOnSelect
        width={180}
        onValueChange={(e: ValueChangeDetails<CollectionItem>) =>
          onChangeValue(e.value)
        }
        value={[currentFilter.value.toString()]}
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
        <Select.Positioner className={classes.positioner}>
          <Select.Content className={classes.content}>
            <Select.ItemGroup className={classes.itemGroup} id="filterByValue">
              {items.map((item, i) => {
                return (
                  <Select.Item className={classes.item} key={i} item={item}>
                    <Select.ItemText className={classes.itemText}>
                      {item.label}
                    </Select.ItemText>
                    <Select.ItemIndicator className={classes.itemIndicator}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </>
  );
};
