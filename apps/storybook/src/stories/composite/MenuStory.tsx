import { Menu, Portal } from "@ark-ui/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@tailor-platform/design-systems";
import { styled } from "@tailor-platform/styled-system/jsx";
import { menu } from "@tailor-platform/styled-system/recipes";

export const MenuStory = () => {
  const [value, setValue] = useState("React");
  const [checked, setChecked] = useState(false);

  const classes = menu();

  return (
    <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner className={classes.positioner}>
          <Menu.Content className={classes.content}>
            <Menu.Item className={classes.item} id="new-tab" value="">
              New Tab...
            </Menu.Item>
            <Menu.Item className={classes.item} id="new-win" value="">
              New Window...
            </Menu.Item>
            <Menu.RadioItemGroup
              value={value}
              onValueChange={(e) => setValue(e.value)}
            >
              <Menu.ItemGroupLabel>JS Frameworks</Menu.ItemGroupLabel>
              {["React", "Solid", "Vue"].map((framework) => (
                <Menu.RadioItem key={framework} value={framework}>
                  <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                  <Menu.ItemText>{framework}</Menu.ItemText>
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>

            <Menu.CheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
              value="checked"
            >
              <Menu.ItemIndicator>✅</Menu.ItemIndicator>
              <Menu.ItemText>Check me</Menu.ItemText>
            </Menu.CheckboxItem>
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
                    <Menu.Item
                      className={classes.item}
                      id="twitter"
                      value="twitter"
                    >
                      Twitter
                    </Menu.Item>
                    <Menu.Item
                      className={classes.item}
                      id="message"
                      value="message"
                    >
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
