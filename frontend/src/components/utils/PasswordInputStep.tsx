/**
 * A component for taking text input from log in / sign up.
 * 
 * For regular inputs, use TextInputStep.tsx
 * Paired with SpringMotionLayout.tsx & JasonPost.tsx
 */
import React from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputStepProps = {
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
};

export default function PasswordInputStep({
    value,
    onChange,
    inputName,
    autoComplete,
    submitLabel = "Next →",
    prevLabel = "← Previous",
    onPrevious,
    onSubmit,
    validate,
    allowEmpty = false,
    }: PasswordInputStepProps) {
        const [error, setError] = React.useState<string | null>(null);
        const [busy, setBusy] = React.useState(false);
        const [show, setShow] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

        const clean = value.trim();
        
        if (!allowEmpty) {
            const msg = validate ? validate(clean) : clean ? null : "Please fill up your password.";
            
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

        return (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
                <label className="block relative">
                    <span className="sr-only">password</span>
                    <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => {
                            setError(null);
                            onChange(e.target.value);
                        }}
                        placeholder="Create a password"
                        className={`w-full rounded-md border px-4 py-3 mb-1 outline-none ring-0 focus:border-blue-500 ${
                        error ? "border-red-400" : "border-gray-200"
                        }`}
                        autoComplete={autoComplete}
                        name={inputName}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
                        >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </label>

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
