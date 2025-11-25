/**
 * A component for taking text input from log in / sign up.
 * 
 * For password, use PasswordInputStep.tsx
 * Paired with SpringMotionLayout.tsx & JasonPost.tsx
 */
import React from "react";

type TextInputStepProps = {
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
    suggestions?: SuggestOption[];
    onSuggestionClick?: (value: string) => void;
};

type SuggestOption = { label: string; value: string };

export default function TextInputStep({
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
    suggestions = [],
    onSuggestionClick,
    }: TextInputStepProps) {
        const [error, setError] = React.useState<string | null>(null);
        const [busy, setBusy] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

        const clean = value.trim();
        
        if (!allowEmpty) {
            const msg = validate ? validate(clean) : clean ? null : "Please fill out the form.";
            
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
        }};

        const handleSuggestionClick = (val: string) => {
            setError(null);
            onChange(val);
            onSuggestionClick?.(val);
        };

        return (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
                <label className="block">
                    <span className="sr-only">{inputName}</span>
                    <input
                        value={value}
                        onChange={(e) => {
                            setError(null);
                            onChange(e.target.value);
                        }}
                        placeholder={placeholder}
                        className={`w-full rounded-md border px-4 py-3 mb-1 outline-none ring-0 focus:border-blue-500 ${
                        error ? "border-red-400" : "border-gray-200"
                        }`}
                        autoComplete={autoComplete}
                        name={inputName}
                        required={!allowEmpty}
                    />
                </label>

                {suggestions.length > 0 && (
                    <ul
                    className="mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-200 bg-white text-sm shadow-sm"
                    role="listbox"
                    >
                    {suggestions.map((opt) => (
                        <li
                        key={opt.value}
                        role="option"
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(opt.value)}
                        >
                        {opt.label}
                        </li>
                    ))}
                    </ul>
                )}

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
