'use client'

import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker as BaseDayPicker, DayProps, Formatters } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type CalendarMode = 'single' | 'multiple' | 'range';

type CalendarProps = {
  classNames?: Record<string, string>;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  captionLayout?: 'buttons' | 'dropdown' | 'dropdown-buttons';
  mode?: CalendarMode;
} & Omit<React.ComponentProps<typeof BaseDayPicker>, 'classNames' | 'captionLayout' | 'mode'>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "buttons",
  buttonVariant = "ghost",
  formatters,
  components,
  mode = 'single',
  ...props
}: CalendarProps) {

  return (
    <BaseDayPicker
      mode={mode as any}
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-gray-800 text-white group/calendar p-3 [--cell-size:2rem] rounded-md shadow-lg [[data-slot=card-content]_&]:bg-gray-800 [[data-slot=popover-content]_&]:bg-gray-800",
        "rtl:**:[.rdp-button_next>svg]:rotate-180",
        "rtl:**:[.rdp-button_previous>svg]:rotate-180",
        className
      )}
      captionLayout="buttons"
      formatters={{
        formatCaption: (date: Date) => {
          return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);
        },
        ...formatters,
      } as Formatters}
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
        IconLeft: (props) => <ChevronLeftIcon className="size-4" {...props} />,
        IconRight: (props) => <ChevronRightIcon className="size-4" {...props} />,
        IconDropdown: (props) => <ChevronDownIcon className="size-4" {...props} />,
        Day: (props) => <CalendarDayButton {...props} />,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton(props: DayProps) {
  const { date, displayMonth } = props;
  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={ref}
      className={cn(
        "h-[--cell-size] w-full rounded-md p-0 text-sm font-normal aria-selected:opacity-100",
        "hover:bg-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "data-selected:bg-blue-600 data-selected:text-white",
        "data-today:font-semibold data-today:text-white",
        "data-outside:text-gray-500 data-outside:hover:bg-transparent",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        !displayMonth && "opacity-50"
      )}
      variant="ghost"
      size="sm"
      {...props}
    >
      {date.getDate()}
    </Button>
  );
}

export { Calendar, CalendarDayButton }
