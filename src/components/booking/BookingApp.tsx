import { useMemo, useState } from "react";
import { addDays, isBefore, startOfDay } from "date-fns";
import { Sparkles, Video, Star } from "lucide-react";
import { MonthCalendar } from "./MonthCalendar";
import { TimeSlots } from "./TimeSlots";
import { BookingForm } from "./BookingForm";
import { cn } from "@/lib/utils";

const DURATIONS = [15, 30, 45];

function generateSlots(date: Date) {
  // Pseudo-random availability based on date
  const seed = date.getDate() + date.getMonth();
  const slots: { time: string; available: boolean }[] = [];
  for (let h = 9; h < 18; h++) {
    for (const m of [0, 30]) {
      const t = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const idx = (h * 2 + m / 30 + seed) % 7;
      slots.push({ time: t, available: idx !== 0 && idx !== 3 });
    }
  }
  return slots;
}

export function BookingApp() {
  const [month, setMonth] = useState(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [step, setStep] = useState<"pick" | "form">("pick");

  const today = startOfDay(new Date());
  const isUnavailable = (d: Date) => {
    if (isBefore(d, today)) return true;
    if (d.getDay() === 0 || d.getDay() === 6) return true; // weekends off
    if (isBefore(addDays(today, 60), d)) return true;
    return false;
  };

  const slots = useMemo(() => (date ? generateSlots(date) : []), [date]);

  const handleSelectTime = (t: string) => {
    setTime(t);
    setStep("form");
  };

  const handleConfirm = async () => {
    await new Promise((r) => setTimeout(r, 1100));
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-xl tracking-tight">Tempo</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Accepting bookings
          </div>
        </header>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
          {/* Organizer card */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-success grid place-items-center text-primary-foreground font-display text-lg">
                  M
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">with</p>
                  <p className="font-medium">Maya Chen</p>
                </div>
              </div>

              <h1 className="font-display text-3xl leading-[1.1] tracking-tight mb-3 text-balance">
                A quiet hour to think out loud.
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Strategy, design critique, or a thorny product question — pick a
                slot and bring whatever's on your mind.
              </p>

              <div className="space-y-2.5 text-sm border-t border-border pt-5">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span>Google Meet · link sent on confirm</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>4.9 · 218 sessions</span>
                </div>
              </div>

              {step === "pick" && (
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Duration
                  </p>
                  <div className="flex gap-1.5">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                          duration === d
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Booking surface */}
          <main className="rounded-3xl border border-border bg-surface shadow-elevated overflow-hidden">
            {step === "pick" ? (
              <div className="grid md:grid-cols-[1fr_280px] min-h-[560px]">
                <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-border">
                  <MonthCalendar
                    month={month}
                    selected={date}
                    onMonthChange={setMonth}
                    onSelect={(d) => {
                      setDate(d);
                      setTime(null);
                    }}
                    isUnavailable={isUnavailable}
                  />
                </div>
                <div className="p-6 lg:p-8 bg-surface-elevated">
                  <TimeSlots
                    date={date}
                    slots={slots}
                    selected={time}
                    onSelect={handleSelectTime}
                    duration={duration}
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 lg:p-10 max-w-xl mx-auto w-full min-h-[560px] flex flex-col">
                {date && time && (
                  <BookingForm
                    date={date}
                    time={time}
                    duration={duration}
                    onBack={() => setStep("pick")}
                    onConfirm={handleConfirm}
                  />
                )}
              </div>
            )}
          </main>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Powered by Tempo · A calmer way to schedule.
        </footer>
      </div>
    </div>
  );
}
