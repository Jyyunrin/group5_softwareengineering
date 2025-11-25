/**
 * Reusable layout for input suggestion. 
 * For examole, this page can be used with LanguageSuggest.ts
 */
import React from "react";

export type Suggestion = { label: string; value: string };

type SuggestInputStepProps = {
  value: string;
  onChange: (v: string) => void;
  inputName: string;
  placeholder?: string;
  autoComplete?: string;
  submitLabel?: string;
  prevLabel?: string;
  onPrevious?: () => void;
  onSubmit: (cleanValue: string) => Promise<void> | void;
  validate?: (v: string) => string | null;
  allowEmpty?: boolean;
  suggestions: (query: string) => Suggestion[]; 
  onPick?: (s: Suggestion) => void; 
};

export default function SuggestInputStep({
  value,
  onChange,
  inputName,
  placeholder = "",
  autoComplete,
  submitLabel = "Next →",
  prevLabel = "← Previous",
  onPrevious,
  onSubmit,
  validate,
  allowEmpty = false,
  suggestions,
  onPick,
}: SuggestInputStepProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const list = React.useMemo(() => {
    const q = value.trim();
    if (!q) return [] as Suggestion[];
    return suggestions(q).slice(0, 6);
  }, [value, suggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = value.trim();
    if (!allowEmpty) {
      const msg = validate ? validate(clean) : clean ? null : "Please fill this field.";
      if (msg) { setError(msg); return; }
    }
    try {
      setBusy(true);
      setError(null);
      await onSubmit(clean);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <label className="block">
        <span className="sr-only">{inputName}</span>
        <div className="relative">
          <input
            value={value}
            onChange={(e) => { setError(null); onChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder={placeholder}
            className={`w-full rounded-md border px-4 py-3 mb-1 outline-none ring-0 focus:border-blue-500 ${error ? "border-red-400" : "border-gray-200"}`}
            autoComplete={autoComplete}
            name={inputName}
            required={!allowEmpty}
          />

          {/* Suggestions dropdown */}
          {open && list.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow">
              <ul className="max-h-56 overflow-auto py-1 text-sm">
                {list.map((s, i) => (
                  <li key={`${s.value}-${i}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { onChange(s.value); setOpen(false); onPick?.(s); }}
                      className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50"
                    >
                      <span>{s.label}</span>
                      <span className="text-xs text-gray-400">Tap to use</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </label>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="pt-2 flex justify-between items-center">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-full border border-gray-400 px-5 py-3 text-center font-medium text-gray-700 hover:bg-gray-100 active:translate-y-[1px] disabled:opacity-50"
          disabled={busy}
        >
          {prevLabel}
        </button>

        <button
          type="submit"
          className="rounded-full bg-gray-900 px-5 py-3 text-center font-medium text-white shadow hover:bg-gray-800 active:translate-y-[1px] disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
