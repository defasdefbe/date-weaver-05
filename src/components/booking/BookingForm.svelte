<script lang="ts">
  import { format } from "date-fns";
  import { Calendar, Clock, Globe, Loader2, Check, ArrowLeft } from "lucide-svelte";
  import { cn } from "@/lib/utils";

  interface Props {
    date: Date;
    time: string;
    duration: number;
    onBack: () => void;
    onConfirm: (data: { name: string; email: string; notes: string }) => Promise<void>;
  }

  let { date, time, duration, onBack, onConfirm }: Props = $props();

  let name = $state("");
  let email = $state("");
  let notes = $state("");
  let errors = $state<{ name?: string; email?: string }>({});
  let loading = $state(false);
  let done = $state(false);

  function inputClass(hasError: boolean) {
    return cn(
      "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm",
      "placeholder:text-muted-foreground/60",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
      hasError ? "border-destructive" : "border-border hover:border-foreground/20",
    );
  }

  function validate() {
    const e: { name?: string; email?: string } = {};
    if (!name.trim()) e.name = "Please tell us your name";
    if (!email.trim()) e.email = "We need your email to confirm";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email looks off";
    errors = e;
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    if (!validate()) return;
    loading = true;
    await onConfirm({ name, email, notes });
    loading = false;
    done = true;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

{#if done}
  <div class="flex flex-col items-center justify-center text-center py-10 px-4 animate-slot-in">
    <div class="relative mb-6">
      <div class="absolute inset-0 rounded-full bg-success/20 blur-2xl"></div>
      <div
        class="relative h-16 w-16 rounded-full bg-success grid place-items-center text-success-foreground animate-check-pop"
      >
        <Check class="h-8 w-8" stroke-width={3} />
      </div>
    </div>
    <h3 class="font-display text-2xl tracking-tight mb-2">You're booked.</h3>
    <p class="text-sm text-muted-foreground max-w-[280px] mb-6">
      A confirmation is on its way to <span class="text-foreground font-medium">{email}</span>
    </p>
    <div class="rounded-xl bg-muted/60 px-4 py-3 text-sm text-foreground">
      {format(date, "EEE, MMM d")} · {time}
    </div>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="flex flex-col h-full">
    <button
      type="button"
      onclick={onBack}
      class="self-start inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft class="h-3.5 w-3.5" /> Change time
    </button>

    <div
      class="rounded-2xl border border-border/60 bg-gradient-to-br from-primary-soft/40 to-accent/20 p-4 mb-5 space-y-2"
    >
      <div class="flex items-center gap-2.5 text-sm">
        <Calendar class="h-4 w-4 text-primary shrink-0" />
        <span class="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
      </div>
      <div class="flex items-center gap-2.5 text-sm">
        <Clock class="h-4 w-4 text-primary shrink-0" />
        <span class="font-medium">{time}</span>
        <span class="text-muted-foreground">· {duration} min</span>
      </div>
      <div class="flex items-center gap-2.5 text-xs text-muted-foreground">
        <Globe class="h-3.5 w-3.5 shrink-0" />
        {timezone}
      </div>
    </div>

    <div class="space-y-4 flex-1">
      <!-- Name field -->
      <label class="block">
        <span class="block text-xs font-semibold text-foreground mb-1.5 tracking-wide"
          >Your name</span
        >
        <input bind:value={name} placeholder="Ada Lovelace" class={inputClass(!!errors.name)} />
        {#if errors.name}
          <span class="block text-xs text-destructive mt-1.5">{errors.name}</span>
        {/if}
      </label>

      <!-- Email field -->
      <label class="block">
        <span class="block text-xs font-semibold text-foreground mb-1.5 tracking-wide"
          >Email address</span
        >
        <input
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          class={inputClass(!!errors.email)}
        />
        {#if errors.email}
          <span class="block text-xs text-destructive mt-1.5">{errors.email}</span>
        {/if}
      </label>

      <!-- Notes field -->
      <label class="block">
        <span class="block text-xs font-semibold text-foreground mb-1.5 tracking-wide"
          >Anything to share? (optional)</span
        >
        <textarea
          bind:value={notes}
          rows={3}
          placeholder="Topics you'd like to cover..."
          class={cn(inputClass(false), "resize-none leading-relaxed")}
        ></textarea>
      </label>
    </div>

    <button
      type="submit"
      disabled={loading}
      class={cn(
        "mt-6 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-foreground text-background font-medium text-sm",
        "hover:bg-foreground/90 transition-all shadow-elevated",
        "disabled:opacity-70 disabled:cursor-wait",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {#if loading}
        <Loader2 class="h-4 w-4 animate-spin" />
        Confirming…
      {:else}
        Confirm booking
      {/if}
    </button>
  </form>
{/if}
