import { Menu, Portal } from "@ark-ui/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button, Checkbox, Radio } from "@tailor-platform/design-systems";
import { styled } from "@tailor-platform/styled-system/jsx";
import { menu } from "@tailor-platform/styled-system/recipes";

export const MenuStory = () => {
  const [value, setValue] = useState<Record<string, string | string[]>>({
    framework: "",
    libraries: [],
  });
  const classes = menu();

  return (
    <Menu.Root
      closeOnSelect={false}
      value={value}
      onValueChange={(data) => {
        setValue((prev) => ({
          ...prev,
          [data.name]: data.value,
        }));
      }}
    >
      <Menu.Trigger asChild>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner className={classes.positioner}>
          <Menu.Content className={classes.content}>
            <Menu.Item className={classes.item} id="new-tab">
              New Tab...
            </Menu.Item>
            <Menu.Item className={classes.item} id="new-win">
              New Window...
            </Menu.Item>
            <Menu.ItemGroup className={classes.itemGroup} id="radio-group">
              <Menu.ItemGroupLabel
                className={classes.itemGroupLabel}
                htmlFor="radio-group"
              >
                Radio Group
              </Menu.ItemGroupLabel>
              <Menu.OptionItem
                className={classes.optionItem}
                name="framework"
                type="radio"
                value="react"
              >
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    React
                  </Radio>
                )}
              </Menu.OptionItem>
              <Menu.OptionItem
                className={classes.optionItem}
                name="framework"
                type="radio"
                value="solid"
              >
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    Solid
                  </Radio>
                )}
              </Menu.OptionItem>
              <Menu.OptionItem
                className={classes.optionItem}
                name="framework"
                type="radio"
                value="vue"
              >
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    Vue
                  </Radio>
                )}
              </Menu.OptionItem>
            </Menu.ItemGroup>

            <Menu.ItemGroup className={classes.itemGroup} id="checkbox-group">
              <Menu.ItemGroupLabel
                className={classes.itemGroupLabel}
                htmlFor="checkbox-group"
              >
                Checkbox Group
              </Menu.ItemGroupLabel>
              <Menu.OptionItem
                className={classes.optionItem}
                name="libraries"
                type="checkbox"
                value="react-1"
              >
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>React</Checkbox>
                )}
              </Menu.OptionItem>
              <Menu.OptionItem
                className={classes.optionItem}
                name="libraries"
                type="checkbox"
                value="solid-1"
              >
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>Solid</Checkbox>
                )}
              </Menu.OptionItem>
              <Menu.OptionItem
                className={classes.optionItem}
                name="libraries"
                type="checkbox"
                value="vue-1"
              >
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>Vue</Checkbox>
                )}
              </Menu.OptionItem>
            </Menu.ItemGroup>
            <Menu.Separator className={classes.separator} />
            <Menu.Root
              closeOnSelect={false}
              positioning={{ placement: "right-start" }}
            >
              <Menu.TriggerItem className={classes.triggerItem}>
                <styled.span flex="1">More options</styled.span>
                <ChevronRight />
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner className={classes.positioner}>
                  <Menu.Content className={classes.content}>
                    <Menu.Item className={classes.item} id="twitter">
                      Twitter
                    </Menu.Item>
                    <Menu.Item className={classes.item} id="message">
                      Message
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
