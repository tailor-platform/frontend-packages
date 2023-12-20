import { DatePicker, type DatePickerProps } from "@ark-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { datePicker } from "@tailor-platform/styled-system/recipes";
import { Flex } from "@tailor-platform/styled-system/jsx";
import { Button, IconButton, Input } from "@tailor-platform/design-systems";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { datePickerTypes } from "../../ark-types";

const meta = {
  title: "Composite/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: { ...datePickerTypes },
} satisfies Meta<DatePickerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const classes = datePicker();

export const Default: Story = {
  render: () => (
    <Flex h={400}>
      <DatePicker.Root className={classes.root} startOfWeek={1}>
        <DatePicker.Label className={classes.label}>
          Date Picker
        </DatePicker.Label>
        <DatePicker.Control className={classes.control}>
          <DatePicker.Input asChild>
            <Input />
          </DatePicker.Input>
          <DatePicker.Trigger asChild>
            <IconButton variant="secondary" aria-label="Open date picker">
              <CalendarIcon />
            </IconButton>
          </DatePicker.Trigger>
        </DatePicker.Control>

        <DatePicker.Positioner>
          <DatePicker.Content className={classes.content}>
            <DatePicker.View className={classes.view} view="day">
              {(api) => (
                <>
                  <DatePicker.ViewControl className={classes.viewControl}>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <Button aria-label="" variant="tertiary">
                        <DatePicker.RangeText />
                      </Button>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table className={classes.table}>
                    <DatePicker.TableHead className={classes.tableHead}>
                      <DatePicker.TableRow>
                        {api.weekDays.map((weekDay, id) => (
                          <DatePicker.TableHeader
                            className={classes.tableHeader}
                            key={id}
                          >
                            {weekDay.narrow}
                          </DatePicker.TableHeader>
                        ))}
                      </DatePicker.TableRow>
                    </DatePicker.TableHead>
                    <DatePicker.TableBody>
                      {api.weeks.map((week, id) => (
                        <DatePicker.TableRow key={id}>
                          {week.map((day, id) => (
                            <DatePicker.TableCell
                              className={classes.tableCell}
                              key={id}
                              value={day}
                            >
                              <DatePicker.TableCellTrigger
                                className={classes.tableCellTrigger}
                                asChild
                              >
                                <Button variant="tertiary" size="xs">
                                  {day.day}
                                </Button>
                              </DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          ))}
                        </DatePicker.TableRow>
                      ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.View>
            <DatePicker.View view="month">
              {(api) => (
                <>
                  <DatePicker.ViewControl className={classes.viewControl}>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <Button variant="tertiary" size="sm">
                        <DatePicker.RangeText />
                      </Button>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {api
                        .getMonthsGrid({ columns: 4, format: "short" })
                        .map((months, id) => (
                          <DatePicker.TableRow key={id}>
                            {months.map((month, id) => (
                              <DatePicker.TableCell
                                className={classes.tableCell}
                                key={id}
                                value={month.value}
                              >
                                <DatePicker.TableCellTrigger asChild>
                                  <Button variant="tertiary">
                                    {month.label}
                                  </Button>
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.View>
            <DatePicker.View view="year">
              {(api) => (
                <>
                  <DatePicker.ViewControl className={classes.viewControl}>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <Button variant="tertiary" size="sm">
                        <DatePicker.RangeText />
                      </Button>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                        <DatePicker.TableRow key={id}>
                          {years.map((year, id) => (
                            <DatePicker.TableCell
                              className={classes.tableCell}
                              key={id}
                              value={year.value}
                            >
                              <DatePicker.TableCellTrigger asChild>
                                <Button variant="tertiary">{year.label}</Button>
                              </DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          ))}
                        </DatePicker.TableRow>
                      ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </Flex>
  ),
};
