import { useMemo } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  month: Date;
  selected: Date | null;
  onMonthChange: (d: Date) => void;
  onSelect: (d: Date) => void;
  isUnavailable: (d: Date) => boolean;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthCalendar({
  month,
  selected,
  onMonthChange,
  onSelect,
  isUnavailable,
}: MonthCalendarProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const arr: Date[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      arr.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return arr;
  }, [month]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
            Pick a date
          </p>
          <h3 className="font-display text-2xl tracking-tight">
            {format(month, "MMMM")}{" "}
            <span className="text-muted-foreground font-normal">
              {format(month, "yyyy")}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(subMonths(month, 1))}
            aria-label="Previous month"
            className="h-9 w-9 rounded-full grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMonthChange(addMonths(month, 1))}
            aria-label="Next month"
            className="h-9 w-9 rounded-full grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 text-center py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month);
          const unavailable = isUnavailable(d);
          const sel = selected && isSameDay(d, selected);
          const today = isToday(d);
          const disabled = !inMonth || unavailable;

          return (
            <button
              key={d.toISOString()}
              disabled={disabled}
              onClick={() => onSelect(d)}
              aria-label={`${format(d, "EEEE, MMMM d")}${unavailable ? ", unavailable" : ", available"}`}
              aria-pressed={!!sel}
              className={cn(
                "relative aspect-square rounded-xl text-sm font-medium transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                !inMonth && "opacity-0 pointer-events-none",
                disabled && inMonth && "text-muted-foreground/40 cursor-not-allowed line-through decoration-1",
                !disabled && !sel && "text-foreground hover:bg-primary-soft hover:scale-[1.04] hover:-translate-y-0.5",
                sel &&
                  "bg-foreground text-background shadow-elevated scale-[1.02]",
                today && !sel && "ring-1 ring-primary/40",
              )}
            >
              {format(d, "d")}
              {today && !sel && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
