'use client'

import * as React from "react"
import { DayPicker as BaseDayPicker } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

interface CalendarProps {
  className?: string
  classNames?: Partial<React.ComponentProps<typeof BaseDayPicker>['classNames']>
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  showOutsideDays?: boolean
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  components?: Partial<React.ComponentProps<typeof BaseDayPicker>['components']>
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  buttonVariant = "ghost",
  selected,
  onSelect,
  disabled,
  initialFocus = false,
  components,
  ...props
}: CalendarProps) {

  const renderWeekdays = () => (
    <div className="flex justify-between text-gray-400 px-1 mb-1 text-xs font-normal">
      {WEEKDAYS.map((day) => (
        <div key={day} className="text-center flex-1">{day}</div>
      ))}
    </div>
  )

  return (
    <div className={cn("relative w-full", className)}>
      {renderWeekdays()}

      <BaseDayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        showOutsideDays={showOutsideDays}
        initialFocus={initialFocus}
        className={cn(
          "bg-gray-50 text-gray-800 group/calendar p-2 rounded-md shadow-lg w-full",
          className
        )}
        formatters={{
          formatCaption: (date: Date) =>
            new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date),
        }}
        classNames={{
          root: "w-full",
          months: "flex flex-col gap-2",
          month: "flex flex-col gap-2",
          nav: "flex w-full items-center justify-between mb-1",
          nav_button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "h-6 w-6 p-0"
          ),
          nav_button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "h-6 w-6 p-0"
          ),
          caption: "hidden",
          caption_label: "text-xs font-normal",
          table: "grid grid-cols-5 gap-1 text-xs",
          head_row: "hidden",
          row: "flex w-full",
          cell: "flex-1",
          day: "relative aspect-square h-6 w-full select-none text-xs font-normal p-0",
          day_today: "bg-blue-500 text-white rounded",
          day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
          day_outside: "hidden",
          ...classNames,
        }}
        components={{
          PreviousMonthButton: ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
            <Button
              variant={buttonVariant}
              className={cn("h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
              {...props}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          ),
          NextMonthButton: ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
            <Button
              variant={buttonVariant}
              className={cn("h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
              {...props}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          ),
          ...components, // safe spread of extra components
        }}
        {...props}
      />
    </div>
  )
}
