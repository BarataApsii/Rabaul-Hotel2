'use client'

import * as React from "react"
import { DayPicker as BaseDayPicker } from "react-day-picker"
import type { DayPickerProps } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type CalendarCaptionLayout = NonNullable<DayPickerProps['captionLayout']>;

interface CalendarProps {
  className?: string;
  classNames?: Partial<React.ComponentProps<typeof BaseDayPicker>['classNames']>;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  captionLayout?: CalendarCaptionLayout;
  showOutsideDays?: boolean;
  formatters?: any;
  components?: any;
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  formatters,
  components,
  selected,
  onSelect,
  disabled,
  initialFocus = false,
  ...props
}: CalendarProps) {
  return (
    <BaseDayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      showOutsideDays={showOutsideDays}
      initialFocus={initialFocus}
      className={cn(
        "bg-gray-800 text-white group/calendar p-3 [--cell-size:2rem] rounded-md shadow-lg",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatCaption: (date: Date) =>
          new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4 md:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
        ),
        caption: "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
        caption_dropdowns: "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
        dropdown: "bg-popover absolute inset-0 opacity-0",
        caption_label: "select-none font-medium text-white text-sm",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-gray-300 flex-1 select-none rounded-md text-[0.8rem] font-normal",
        row: "mt-2 flex w-full",
        cell: "w-[--cell-size] select-none",
        day: "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
        day_range_start: "bg-accent rounded-l-md",
        day_range_middle: "rounded-none",
        day_range_end: "bg-accent rounded-r-md",
        day_today: "bg-blue-600 text-white rounded-md data-[selected=true]:rounded-none",
        day_outside: "text-gray-500 aria-selected:text-gray-400",
        day_disabled: "text-gray-500 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
          <Button
            variant={buttonVariant}
            className={cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)}
            {...props}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        ),
        NextMonthButton: ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
          <Button
            variant={buttonVariant}
            className={cn("h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", className)}
            {...props}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        ),
        Day: (props) => {
          // Type assertion for the day cell props
          const dayProps = props as unknown as {
            date: Date;
            displayMonth: Date;
            className?: string;
            style?: React.CSSProperties;
            modifiers: Record<string, boolean>;
            onClick?: (e: React.MouseEvent) => void;
          };
          
          const { date, className, style } = dayProps;
          const modifiers = dayProps.modifiers || {};
          const isDisabled = modifiers['disabled'] || false;
          const isSelected = modifiers['selected'] || false;
          const isToday = modifiers['today'] || false;
          const isOutside = modifiers['outside'] || false;
          
          return (
            <div
              className={cn('day-cell', className)}
              style={style}
              onClick={(e) => {
                if (isDisabled) return;
                dayProps.onClick?.(e);
              }}
              role="button"
              aria-selected={isSelected}
              data-today={isToday}
              data-outside={isOutside}
              data-disabled={isDisabled}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-[--cell-size] w-full rounded-md p-0 text-sm font-normal",
                  "hover:bg-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isSelected && "bg-blue-600 text-white",
                  isToday && "font-semibold text-white",
                  isDisabled && "opacity-50 cursor-not-allowed",
                  isOutside && "text-gray-500 aria-selected:text-gray-400"
                )}
                disabled={isDisabled}
              >
                {date.getDate()}
              </Button>
            </div>
          );
        },
        ...components,
      }}
      {...props}
    />
  )
}
