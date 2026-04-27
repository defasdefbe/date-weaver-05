<script lang="ts">
  import { addDays, isBefore, startOfDay } from "date-fns";
  import { Sparkles, Video, Star } from "lucide-svelte";
  import MonthCalendar from "./MonthCalendar.svelte";
  import TimeSlots from "./TimeSlots.svelte";
  import BookingForm from "./BookingForm.svelte";
  import { cn } from "@/lib/utils";

  const DURATIONS = [15, 30, 45];

  function generateSlots(date: Date) {
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

  let month = $state(new Date());
  let date = $state<Date | null>(null);
  let time = $state<string | null>(null);
  let duration = $state(30);
  let step = $state<"pick" | "form">("pick");

  const today = startOfDay(new Date());

  function isUnavailable(d: Date) {
    if (isBefore(d, today)) return true;
    if (d.getDay() === 0 || d.getDay() === 6) return true;
    if (isBefore(addDays(today, 60), d)) return true;
    return false;
  }

  let slots = $derived(date ? generateSlots(date) : []);

  function handleSelectTime(t: string) {
    time = t;
    step = "form";
  }

  async function handleConfirm() {
    await new Promise((r) => setTimeout(r, 1100));
  }
</script>

<div class="min-h-screen bg-background bg-mesh">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
    <!-- Header -->
    <header class="flex items-center justify-between mb-10">
      <div class="flex items-center gap-2.5">
        <div class="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center">
          <Sparkles class="h-4 w-4" />
        </div>
        <span class="font-display text-xl tracking-tight">Tempo</span>
      </div>
      <div class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
        <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot"></span>
        Accepting bookings
      </div>
    </header>

    <div class="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
      <!-- Organizer card -->
      <aside class="lg:sticky lg:top-8 lg:self-start">
        <div class="rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <div class="flex items-center gap-3 mb-5">
            <div
              class="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-success grid place-items-center text-primary-foreground font-display text-lg"
            >
              M
            </div>
            <div>
              <p class="text-xs text-muted-foreground">with</p>
              <p class="font-medium">Maya Chen</p>
            </div>
          </div>

          <h1 class="font-display text-3xl leading-[1.1] tracking-tight mb-3 text-balance">
            A quiet hour to think out loud.
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed mb-6">
            Strategy, design critique, or a thorny product question — pick a slot and bring
            whatever's on your mind.
          </p>

          <div class="space-y-2.5 text-sm border-t border-border pt-5">
            <div class="flex items-center gap-2.5 text-muted-foreground">
              <Video class="h-4 w-4" />
              <span>Google Meet · link sent on confirm</span>
            </div>
            <div class="flex items-center gap-2.5 text-muted-foreground">
              <Star class="h-4 w-4" />
              <span>4.9 · 218 sessions</span>
            </div>
          </div>

          {#if step === "pick"}
            <div class="mt-6 pt-5 border-t border-border">
              <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Duration</p>
              <div class="flex gap-1.5">
                {#each DURATIONS as d}
                  <button
                    onclick={() => (duration = d)}
                    class={cn(
                      "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                      duration === d
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {d}m
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <!-- Booking surface -->
      <main class="rounded-3xl border border-border bg-surface shadow-elevated overflow-hidden">
        {#if step === "pick"}
          <div class="grid md:grid-cols-[1fr_280px] min-h-[560px]">
            <div class="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-border">
              <MonthCalendar
                {month}
                selected={date}
                onMonthChange={(d) => {
                  month = d;
                }}
                onSelect={(d) => {
                  date = d;
                  time = null;
                }}
                {isUnavailable}
              />
            </div>
            <div class="p-6 lg:p-8 bg-surface-elevated">
              <TimeSlots {date} {slots} selected={time} onSelect={handleSelectTime} {duration} />
            </div>
          </div>
        {:else}
          <div class="p-6 lg:p-10 max-w-xl mx-auto w-full min-h-[560px] flex flex-col">
            {#if date && time}
              <BookingForm
                {date}
                {time}
                {duration}
                onBack={() => {
                  step = "pick";
                }}
                onConfirm={handleConfirm}
              />
            {/if}
          </div>
        {/if}
      </main>
    </div>

    <footer class="mt-10 text-center text-xs text-muted-foreground">
      Powered by Tempo · A calmer way to schedule.
    </footer>
  </div>
</div>
