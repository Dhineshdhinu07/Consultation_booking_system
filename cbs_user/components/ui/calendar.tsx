"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-gray-900 dark:text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent dark:bg-[#1C1C1E] border-gray-200 dark:border-[#2C2C2E] p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-[#2C2C2E]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-50 dark:bg-[#1C1C1E] [&:has([aria-selected])]:bg-gray-50 dark:bg-[#1C1C1E] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2C2C2E] hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-[#2C2C2E] focus:text-gray-900 dark:focus:text-white"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white hover:text-white hover:bg-[#0056b3] dark:hover:bg-[#3B82F6] focus:bg-[#007BFF] dark:focus:bg-[#60A5FA] focus:text-white",
        day_today: "bg-gray-100 dark:bg-[#2C2C2E] text-gray-900 dark:text-white",
        day_outside:
          "day-outside text-gray-400 dark:text-gray-500 opacity-50 aria-selected:bg-gray-50 dark:bg-[#1C1C1E] aria-selected:text-gray-400 dark:text-gray-500 aria-selected:opacity-30",
        day_disabled: "text-gray-400 dark:text-gray-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-50 dark:bg-[#1C1C1E] aria-selected:text-gray-900 dark:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
