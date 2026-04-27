import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Globe, Loader2, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  date: Date;
  time: string;
  duration: number;
  onBack: () => void;
  onConfirm: (data: { name: string; email: string; notes: string }) => Promise<void>;
}

export function BookingForm({ date, time, duration, onBack, onConfirm }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Please tell us your name";
    if (!email.trim()) e.email = "We need your email to confirm";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email looks off";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await onConfirm({ name, email, notes });
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-slot-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-success/20 blur-2xl" />
          <div className="relative h-16 w-16 rounded-full bg-success grid place-items-center text-success-foreground animate-check-pop">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
        </div>
        <h3 className="font-display text-2xl tracking-tight mb-2">You're booked.</h3>
        <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
          A confirmation is on its way to{" "}
          <span className="text-foreground font-medium">{email}</span>
        </p>
        <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-foreground">
          {format(date, "EEE, MMM d")} · {time}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <button
        type="button"
        onClick={onBack}
        className="self-start inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Change time
      </button>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary-soft/40 to-accent/20 p-4 mb-5 space-y-2">
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium">{time}</span>
          <span className="text-muted-foreground">· {duration} min</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5 shrink-0" />
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <Field
          label="Your name"
          error={errors.name}
          input={
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className={inputClass(!!errors.name)}
            />
          }
        />
        <Field
          label="Email address"
          error={errors.email}
          input={
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="[email protected]"
              className={inputClass(!!errors.email)}
            />
          }
        />
        <Field
          label="Anything to share? (optional)"
          input={
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Topics you'd like to cover..."
              className={cn(inputClass(false), "resize-none leading-relaxed")}
            />
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mt-6 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-foreground text-background font-medium text-sm",
          "hover:bg-foreground/90 transition-all shadow-elevated",
          "disabled:opacity-70 disabled:cursor-wait",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming…
          </>
        ) : (
          <>Confirm booking</>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-foreground mb-1.5 tracking-wide">
        {label}
      </span>
      {input}
      {error && (
        <span className="block text-xs text-destructive mt-1.5">{error}</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm",
    "placeholder:text-muted-foreground/60",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
    hasError ? "border-destructive" : "border-border hover:border-foreground/20",
  );
}
