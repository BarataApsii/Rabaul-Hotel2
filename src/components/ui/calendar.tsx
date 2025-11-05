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
    <div className={cn("relative w-full", className)}>
      <BaseDayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        showOutsideDays={showOutsideDays}
        initialFocus={initialFocus}
        className={cn(
          "bg-white text-gray-800 p-4 rounded-lg shadow-lg w-full border border-gray-200",
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
          nav: "flex gap-1",
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            "h-7 w-7 p-0"
          ),
          nav_button_previous: "absolute left-4",
          nav_button_next: "absolute right-4",
          table: "w-full border-collapse",
          head_row: "flex justify-between mb-2",
          head_cell: "w-10 text-xs text-gray-500 font-medium text-center",
          row: "flex w-full justify-between mt-2",
          cell: "m-0 p-0 w-10 h-10 relative [&:has([aria-selected])]:bg-accent",
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100"
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
          ...components, // safe spread of extra components
        }}
        {...props}
      />
    </div>
  )
}
