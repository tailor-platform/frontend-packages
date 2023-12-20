import type { Meta, StoryObj } from "@storybook/react";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuTrigger,
  Portal,
} from "@ark-ui/react";
import { AppBar, AppBarProps, Text } from "@tailor-platform/design-systems";
import {
  appBar,
  appBarMenuTrigger,
  menu,
} from "@tailor-platform/styled-system/recipes";
import { css } from "@tailor-platform/styled-system/css";
import { ChevronDown } from "lucide-react";
import { Flex } from "@tailor-platform/styled-system/jsx";

const meta = {
  title: "Standalone/AppBar",
  component: AppBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<AppBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const appBarClasses = appBar();
    const menuTriggerClasses = appBarMenuTrigger();
    return (
      <AppBar>
        <Text className={appBarClasses.title}>header title</Text>
        <Menu>
          <MenuTrigger aria-label="Open" className={menuTriggerClasses.root}>
            <Flex className={menuTriggerClasses.content}>
              <Text>Open Button</Text>
              <ChevronDown />
            </Flex>
          </MenuTrigger>
          <Portal>
            <MenuPositioner className={menu()}>
              <MenuContent>
                <MenuItem id="profile" className={css({ color: "blue.600" })}>
                  profile
                </MenuItem>
                <MenuItem id="logout" className={css({ color: "red.600" })}>
                  logout
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </Menu>
      </AppBar>
    );
  },
};
