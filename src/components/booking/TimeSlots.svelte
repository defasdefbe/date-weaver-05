<script lang="ts">
  import { format } from "date-fns";
  import { cn } from "@/lib/utils";

  interface Props {
    date: Date | null;
    slots: { time: string; available: boolean }[];
    selected: string | null;
    onSelect: (t: string) => void;
    duration: number;
  }

  let { date, slots, selected, onSelect, duration }: Props = $props();
</script>

{#if !date}
  <div class="h-full flex flex-col items-center justify-center text-center px-6 py-12">
    <div class="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
      <span class="h-2 w-2 rounded-full bg-primary animate-pulse-dot"></span>
    </div>
    <p class="text-sm text-muted-foreground max-w-[200px]">Select a date to see available times</p>
  </div>
{:else}
  <div class="flex flex-col h-full">
    <div class="mb-5">
      <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
        {format(date, "EEEE")}
      </p>
      <h3 class="font-display text-2xl tracking-tight">
        {format(date, "MMMM d")}
      </h3>
    </div>

    <div class="grid grid-cols-2 gap-2 overflow-y-auto pr-1 -mr-1 max-h-[420px]">
      {#each slots as s, i (s.time)}
        {@const isSel = selected === s.time}
        <button
          disabled={!s.available}
          onclick={() => onSelect(s.time)}
          aria-label={`${s.time}, ${duration} minutes, ${s.available ? "available" : "unavailable"}`}
          style="animation-delay: {i * 25}ms"
          class={cn(
            "group relative animate-slot-in rounded-xl border px-4 py-3 text-left transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            s.available &&
              !isSel &&
              "border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-soft",
            isSel &&
              "border-foreground bg-foreground text-background shadow-elevated -translate-y-0.5",
            !s.available &&
              "border-dashed border-border/60 bg-muted/30 text-muted-foreground/50 cursor-not-allowed",
          )}
        >
          <span class="block text-sm font-semibold tabular-nums">{s.time}</span>
          <span
            class={cn(
              "block text-[11px] mt-0.5",
              isSel ? "text-background/70" : "text-muted-foreground",
            )}
          >
            {s.available ? `${duration} min` : "Booked"}
          </span>
        </button>
      {/each}
    </div>
  </div>
{/if}
