/**
 * Date picker component for selecting dates
 */

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
  const goToPreviousDay = () => onDateChange(subDays(date, 1));
  const goToNextDay = () => onDateChange(addDays(date, 1));
  const goToToday = () => onDateChange(new Date());

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Previous Day */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousDay}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[180px] justify-start gap-2 font-medium"
          >
            <CalendarIcon className="h-4 w-4" />
            {format(date, "EEEE, MMM d")}
            {isToday(date) && (
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDateChange(d)}
            initialFocus
            disabled={(d) => d > new Date()}
          />
        </PopoverContent>
      </Popover>

      {/* Next Day */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        className="h-9 w-9"
        disabled={isToday(date)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Today Button */}
      {!isToday(date) && (
        <Button
          variant="soft"
          size="sm"
          onClick={goToToday}
          className="ml-2"
        >
          Today
        </Button>
      )}
    </div>
  );
}
