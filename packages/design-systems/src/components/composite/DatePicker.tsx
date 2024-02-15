import { DatePicker as ArkDatePicker } from "@ark-ui/react";
import { forwardRef } from "react";

import { type HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import { datePicker } from "@tailor-platform/styled-system/recipes";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export type DatePickerProps = HTMLStyledProps<"div"> & {
  label?: string;
};

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (props: DatePickerProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { label } = props;
    const classes = datePicker();
    return (
      <ArkDatePicker.Root className={classes.root} startOfWeek={1}>
        {label && (
          <ArkDatePicker.Label className={classes.label}>
            {label}
          </ArkDatePicker.Label>
        )}
        <ArkDatePicker.Control className={classes.control}>
          <ArkDatePicker.Input asChild>
            <Input ref={ref} />
          </ArkDatePicker.Input>
          <ArkDatePicker.Trigger asChild>
            <IconButton variant="secondary" aria-label="Open date picker">
              <CalendarIcon />
            </IconButton>
          </ArkDatePicker.Trigger>
        </ArkDatePicker.Control>

        <ArkDatePicker.Positioner>
          <ArkDatePicker.Content className={classes.content}>
            <ArkDatePicker.View className={classes.view} view="day">
              {(api) => (
                <>
                  <ArkDatePicker.ViewControl className={classes.viewControl}>
                    <ArkDatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </ArkDatePicker.PrevTrigger>
                    <ArkDatePicker.ViewTrigger asChild>
                      <Button aria-label="" variant="tertiary">
                        <ArkDatePicker.RangeText />
                      </Button>
                    </ArkDatePicker.ViewTrigger>
                    <ArkDatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </ArkDatePicker.NextTrigger>
                  </ArkDatePicker.ViewControl>
                  <ArkDatePicker.Table className={classes.table}>
                    <ArkDatePicker.TableHead className={classes.tableHead}>
                      <ArkDatePicker.TableRow>
                        {api.weekDays.map((weekDay, id) => (
                          <ArkDatePicker.TableHeader
                            className={classes.tableHeader}
                            key={id}
                          >
                            {weekDay.narrow}
                          </ArkDatePicker.TableHeader>
                        ))}
                      </ArkDatePicker.TableRow>
                    </ArkDatePicker.TableHead>
                    <ArkDatePicker.TableBody>
                      {api.weeks.map((week, id) => (
                        <ArkDatePicker.TableRow key={id}>
                          {week.map((day, id) => (
                            <ArkDatePicker.TableCell
                              className={classes.tableCell}
                              key={id}
                              value={day}
                            >
                              <ArkDatePicker.TableCellTrigger
                                className={classes.tableCellTrigger}
                                asChild
                              >
                                <Button variant="tertiary" size="xs">
                                  {day.day}
                                </Button>
                              </ArkDatePicker.TableCellTrigger>
                            </ArkDatePicker.TableCell>
                          ))}
                        </ArkDatePicker.TableRow>
                      ))}
                    </ArkDatePicker.TableBody>
                  </ArkDatePicker.Table>
                </>
              )}
            </ArkDatePicker.View>
            <ArkDatePicker.View view="month">
              {(api) => (
                <>
                  <ArkDatePicker.ViewControl className={classes.viewControl}>
                    <ArkDatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </ArkDatePicker.PrevTrigger>
                    <ArkDatePicker.ViewTrigger asChild>
                      <Button variant="tertiary" size="sm">
                        <ArkDatePicker.RangeText />
                      </Button>
                    </ArkDatePicker.ViewTrigger>
                    <ArkDatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </ArkDatePicker.NextTrigger>
                  </ArkDatePicker.ViewControl>
                  <ArkDatePicker.Table>
                    <ArkDatePicker.TableBody>
                      {api
                        .getMonthsGrid({ columns: 4, format: "short" })
                        .map((months, id) => (
                          <ArkDatePicker.TableRow key={id}>
                            {months.map((month, id) => (
                              <ArkDatePicker.TableCell
                                className={classes.tableCell}
                                key={id}
                                value={month.value}
                              >
                                <ArkDatePicker.TableCellTrigger asChild>
                                  <Button variant="tertiary">
                                    {month.label}
                                  </Button>
                                </ArkDatePicker.TableCellTrigger>
                              </ArkDatePicker.TableCell>
                            ))}
                          </ArkDatePicker.TableRow>
                        ))}
                    </ArkDatePicker.TableBody>
                  </ArkDatePicker.Table>
                </>
              )}
            </ArkDatePicker.View>
            <ArkDatePicker.View view="year">
              {(api) => (
                <>
                  <ArkDatePicker.ViewControl className={classes.viewControl}>
                    <ArkDatePicker.PrevTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronLeftIcon />
                      </IconButton>
                    </ArkDatePicker.PrevTrigger>
                    <ArkDatePicker.ViewTrigger asChild>
                      <Button variant="tertiary" size="sm">
                        <ArkDatePicker.RangeText />
                      </Button>
                    </ArkDatePicker.ViewTrigger>
                    <ArkDatePicker.NextTrigger asChild>
                      <IconButton aria-label="" variant="tertiary" size="sm">
                        <ChevronRightIcon />
                      </IconButton>
                    </ArkDatePicker.NextTrigger>
                  </ArkDatePicker.ViewControl>
                  <ArkDatePicker.Table>
                    <ArkDatePicker.TableBody>
                      {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                        <ArkDatePicker.TableRow key={id}>
                          {years.map((year, id) => (
                            <ArkDatePicker.TableCell
                              className={classes.tableCell}
                              key={id}
                              value={year.value}
                            >
                              <ArkDatePicker.TableCellTrigger asChild>
                                <Button variant="tertiary">{year.label}</Button>
                              </ArkDatePicker.TableCellTrigger>
                            </ArkDatePicker.TableCell>
                          ))}
                        </ArkDatePicker.TableRow>
                      ))}
                    </ArkDatePicker.TableBody>
                  </ArkDatePicker.Table>
                </>
              )}
            </ArkDatePicker.View>
          </ArkDatePicker.Content>
        </ArkDatePicker.Positioner>
      </ArkDatePicker.Root>
    );
  },
);

ArkDatePicker.displayName = "DatePicker";
