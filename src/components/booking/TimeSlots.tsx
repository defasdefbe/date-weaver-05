import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlotsProps {
  date: Date | null;
  slots: { time: string; available: boolean }[];
  selected: string | null;
  onSelect: (t: string) => void;
  duration: number;
}

export function TimeSlots({ date, slots, selected, onSelect, duration }: TimeSlotsProps) {
  if (!date) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Select a date to see available times
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
          {format(date, "EEEE")}
        </p>
        <h3 className="font-display text-2xl tracking-tight">
          {format(date, "MMMM d")}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 -mr-1 max-h-[420px]">
        {slots.map((s, i) => {
          const isSel = selected === s.time;
          return (
            <button
              key={s.time}
              disabled={!s.available}
              onClick={() => onSelect(s.time)}
              aria-label={`${s.time}, ${duration} minutes, ${s.available ? "available" : "unavailable"}`}
              style={{ animationDelay: `${i * 25}ms` }}
              className={cn(
                "group relative animate-slot-in rounded-xl border px-4 py-3 text-left transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                s.available && !isSel &&
                  "border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-soft",
                isSel &&
                  "border-foreground bg-foreground text-background shadow-elevated -translate-y-0.5",
                !s.available &&
                  "border-dashed border-border/60 bg-muted/30 text-muted-foreground/50 cursor-not-allowed",
              )}
            >
              <span className="block text-sm font-semibold tabular-nums">
                {s.time}
              </span>
              <span
                className={cn(
                  "block text-[11px] mt-0.5",
                  isSel ? "text-background/70" : "text-muted-foreground",
                )}
              >
                {s.available ? `${duration} min` : "Booked"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
