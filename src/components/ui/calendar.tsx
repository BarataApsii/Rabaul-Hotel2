'use client'

import * as React from "react"
import { DayPicker as BaseDayPicker } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type CalendarCaptionLayout = 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';

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

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

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

  // Custom render for weekday headers (Mon-Fri)
  const renderWeekdays = () => (
    <div className="flex justify-between text-gray-300 px-1 mb-2">
      {WEEKDAYS.map((day) => (
        <div key={day} className="text-center font-medium flex-1">
          {day}
        </div>
      ))}
    </div>
  )

  return (
    <div className={cn("relative", className)}>
      {renderWeekdays()}

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
        captionLayout={captionLayout} // now buttons
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
          caption: "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size] text-white font-medium",
          table: "grid grid-cols-5 gap-1", // Mon-Fri only
          row: "flex w-full",
          cell: "flex-1",
          day: "relative aspect-square h-full w-full select-none p-0 text-center",
          day_today: "bg-blue-600 text-white rounded-md",
          day_disabled: "text-gray-500 opacity-50",
          day_outside: "hidden", // hide Sat & Sun
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
          ...components,
        }}
        {...props}
      />
    </div>
  )
}
