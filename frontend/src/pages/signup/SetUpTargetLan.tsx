/**
 * This page is a part of sign up.
 */
import React from "react";
import { suggestLanguages } from "../../components/utils/LanguageSuggest";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SetUpTargetLan({ onNext, onPrev }: StepProps) {
  const [targetLan, setTargetLan] = React.useState("");
  const { update, data } = useSignup() ?? {};

  React.useEffect(() => {
    try {
      if (data?.targetLan) setTargetLan(data.targetLan);
    } catch (err) {
      console.error("[SetUpTargetLan] Failed to initialize target language:", err);
    }
  }, [data?.targetLan]);

  const suggestions = React.useMemo(
    () => suggestLanguages(targetLan),
    [targetLan]
  );

  const validate = (s: string) => {
    const v = (s ?? "").trim();
    if (!v) return "Please choose a target language.";

    if (v.length < 2) return "Language must be at least 2 characters.";
    if (v.length > 64) return "Language name looks too long.";

    const suggestions = suggestLanguages(v);

    const exact = suggestions.find(
      (opt) => opt.label.toLowerCase() === v.toLowerCase()
    );
    if (exact) return null;


    if (suggestions.length > 0) {
      const list = suggestions.map((s) => s.label).join(", ");
      return `I don't recognize "${v}" as a supported language.\nDid you mean: ${list}?`;
    }

    return `I don't recognize "${v}" as a supported language.\nTry typing the English name, e.g. "Korean" or "Japanese".`;
  };


  const submitTargetLan = async (cleanTargetLan: string) => {
    try {
      const trimmed = (cleanTargetLan ?? "").trim();
      const errMsg = validate(trimmed);
      if (errMsg) throw new Error(errMsg);

      if (typeof update !== "function") {
        console.error("[SetUpTargetLan] Signup context not ready — cannot update target language.");
        alert("Signup system not ready. Please refresh and try again.");
        return;
      }

      await Promise.resolve(update({ targetLan: trimmed }));
      onNext?.();
    } catch (err) {
      console.error("[SetUpTargetLan] Failed to submit target language:", err);
      alert((err as Error).message || "An error occurred while saving your target language.");
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["Choose", "Target", "Language"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={targetLan}
        onChange={(v) => {
          try {
            setTargetLan(v);
          } catch (err) {
            console.error("[SetUpTargetLan] Failed to update target language state:", err);
          }
        }}
        inputName="targetlang"
        placeholder="e.g., English, 日本語, 한국어"
        autoComplete="off"
        onPrevious={() => {
          try {
            onPrev?.();
          } catch (err) {
            console.error("[SetUpTargetLan] Previous navigation failed:", err);
          }
        }}
        onSubmit={submitTargetLan}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
        suggestions={suggestions}
        onSuggestionClick={(val) => {
          setTargetLan(val);
        }}
      />
    </SpringMotionLayout>
  );
}
