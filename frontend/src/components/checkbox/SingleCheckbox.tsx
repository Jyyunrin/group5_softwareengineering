/**
 * Reusable checkbox component for a single choice.
 */

import React from "react";

type Option = { label: string; value: string };

type SingleCheckboxStepProps = {
  value: string | null;
  onChange: (val: string) => void;
  options: Option[];
  inputName: string;
  submitLabel?: string;
  prevLabel?: string;
  onPrevious?: () => void;
  onSubmit: (cleanValue: string) => Promise<void> | void; 
  validate?: (val: string) => string | null;
  allowEmpty?: boolean; 
};

export default function SingleCheckboxStep({
  value,
  onChange,
  options,
  inputName,
  submitLabel = "Next →",
  prevLabel = "← Previous",
  onPrevious,
  onSubmit,
  validate,
  allowEmpty = false,
}: SingleCheckboxStepProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const toggle = (val: string) => {
    setError(null);
    onChange(value === val ? "" : val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clean = value?.trim() || "";

    if (!allowEmpty) {
      const msg = validate ? validate(clean) : clean ? null : "Please select one option.";
      if (msg) {
        setError(msg);
        return;
      }
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
      <fieldset className="space-y-2">
        <legend className="sr-only">{inputName}</legend>

        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all select-none ${
                checked
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                name={inputName}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="w-5 h-5 accent-blue-600"
                aria-label={opt.label}
              />
              <span className="text-base font-medium">{opt.label}</span>
            </label>
          );
        })}
      </fieldset>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

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
