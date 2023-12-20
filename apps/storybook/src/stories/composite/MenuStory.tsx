import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuOptionItem,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
  Portal,
} from "@ark-ui/react";
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

  return (
    <Menu
      closeOnSelect={false}
      value={value}
      onValueChange={(data) => {
        setValue((prev) => ({
          ...prev,
          [data.name]: data.value,
        }));
      }}
    >
      <MenuTrigger asChild>
        <Button>Open menu</Button>
      </MenuTrigger>
      <Portal>
        <MenuPositioner className={menu()}>
          <MenuContent>
            <MenuItem id="new-tab">New Tab...</MenuItem>
            <MenuItem id="new-win">New Window...</MenuItem>
            <MenuItemGroup id="radio-group">
              <MenuItemGroupLabel htmlFor="radio-group">
                Radio Group
              </MenuItemGroupLabel>
              <MenuOptionItem name="framework" type="radio" value="react">
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    React
                  </Radio>
                )}
              </MenuOptionItem>
              <MenuOptionItem name="framework" type="radio" value="solid">
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    Solid
                  </Radio>
                )}
              </MenuOptionItem>
              <MenuOptionItem name="framework" type="radio" value="vue">
                {({ isChecked }) => (
                  <Radio name="framework" defaultChecked={isChecked}>
                    Vue
                  </Radio>
                )}
              </MenuOptionItem>
            </MenuItemGroup>

            <MenuItemGroup id="checkbox-group">
              <MenuItemGroupLabel htmlFor="checkbox-group">
                Checkbox Group
              </MenuItemGroupLabel>
              <MenuOptionItem name="libraries" type="checkbox" value="react-1">
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>React</Checkbox>
                )}
              </MenuOptionItem>
              <MenuOptionItem name="libraries" type="checkbox" value="solid-1">
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>Solid</Checkbox>
                )}
              </MenuOptionItem>
              <MenuOptionItem name="libraries" type="checkbox" value="vue-1">
                {({ isChecked }) => (
                  <Checkbox checked={isChecked}>Vue</Checkbox>
                )}
              </MenuOptionItem>
            </MenuItemGroup>
            <MenuSeparator />
            <Menu
              closeOnSelect={false}
              positioning={{ placement: "right-start" }}
            >
              <MenuTriggerItem>
                <styled.span flex="1">More options</styled.span>
                <ChevronRight />
              </MenuTriggerItem>
              <Portal>
                <MenuPositioner className={menu()}>
                  <MenuContent>
                    <MenuItem id="twitter">Twitter</MenuItem>
                    <MenuItem id="message">Message</MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </Menu>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </Menu>
  );
};
