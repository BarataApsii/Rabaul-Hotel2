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
  return (
    <div className={cn("relative w-full min-w-[300px]", className)}>
      <BaseDayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        showOutsideDays={showOutsideDays}
        initialFocus={initialFocus}
        numberOfMonths={1} // only display 1 month
        captionLayout="label" // arrow buttons navigation, no dropdown
        className={cn(
          "bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200",
          className
        )}
        formatters={{
          formatCaption: (date: Date) =>
            new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date),
        }}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "space-y-4 w-full",
          caption: "flex justify-between items-center mb-4 px-1",
          caption_label: "text-sm font-medium text-gray-900",
          nav: "flex justify-between px-1",
          nav_button: cn(
            buttonVariants({ variant: buttonVariant }),
            "h-7 w-7 p-0"
          ),
          nav_button_previous: "",
          nav_button_next: "",
          table: "w-full border-collapse",
          head_row: "grid grid-cols-7 gap-0 mb-1 w-full",
          head_cell: "flex items-center justify-center text-xs text-gray-500 font-medium p-0 w-9 h-6",
          row: "grid grid-cols-7 gap-0 mt-1 w-full",
          cell: "flex items-center justify-center p-0 w-9 h-9 relative [&:has([aria-selected])]:bg-accent",
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            "h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-gray-100"
          ),
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
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
          ...components,
        }}
        {...props}
      />
    </div>
  )
}
