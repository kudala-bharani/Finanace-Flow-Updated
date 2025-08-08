import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className = "",
  minDate,
  maxDate,
}) => {
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => new Date(), []);
  const displayDate = value || today;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 bg-muted border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
            className
          )}
        >
          <span>
            {displayDate
              ? displayDate.toLocaleDateString()
              : <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          <CalendarIcon className="w-5 h-5 ml-2 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-auto bg-popover">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={(date: Date | undefined) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
          fromDate={minDate}
          toDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}; 