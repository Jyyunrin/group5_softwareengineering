/**
 * This component is for Json-Post, which is used for user input take?
 * Currently debugging this page.
 * Paired with TextInputStep.tsx
 * 
*/
import React from "react";

export function JsonPost<TBody extends object, TResp = any>(url: string, options?: RequestInit) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const post = React.useCallback(async (body: TBody): Promise<TResp> => {
        try {
            setLoading(true);
            setError(null);
                const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                ...options,
                });
            const json = (await res.json()) as TResp;
           
            if (!res.ok) throw new Error((json as any)?.message || `HTTP ${res.status}`);
            return json;
        } catch (e: any) {
            setError(e?.message || "Network error");
            throw e;
        } finally {
            setLoading(false);
        }
        }, [url, options]);


    return { post, loading, error } as const;
}