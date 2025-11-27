/**
 * This page is a part of sign up.
 */
import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import PasswordInputStep from "../../components/utils/PasswordInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function PasswordStep({ onNext, onPrev }: StepProps) {
  const [password, setPassword] = React.useState("");
  const { update, data } = useSignup() ?? {};

  React.useEffect(() => {
    try {
      if (data?.password) setPassword(data.password);
    } catch (err) {
      console.error("[PasswordStep] Failed to initialize password:", err);
    }
  }, [data?.password]);

  const validatePassword = (s: string) => {
    if (!s) return "Please enter a password.";
    if (s.trim().length < 8) return "Password must be at least 8 characters.";
    return null;
  };
  
  const submitPassword = async (cleanPassword: string) => {
    try {
      const trimmed = (cleanPassword ?? "").trim();
      const errMsg = validatePassword(trimmed);
      if (errMsg) throw new Error(errMsg);

      if (typeof update !== "function") {
        console.error("[PasswordStep] Signup context not ready — cannot update password.");
        alert("Signup system not ready. Please refresh and try again.");
        return;
      }

      await Promise.resolve(update({ password: trimmed }));
      onNext?.();
    } catch (err) {
      console.error("[PasswordStep] Failed to submit password:", err);
      alert((err as Error).message || "An error occurred while saving your password.");
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["Create", "A", "Password"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <PasswordInputStep
        value={password}
        onChange={(v) => {
          try {
            setPassword(v);
          } catch (err) {
            console.error("[PasswordStep] Failed to update password state:", err);
          }
        }}
        inputName="password"
        placeholder="password"
        autoComplete="new-password"
        onPrevious={() => {
          try {
            onPrev?.();
          } catch (err) {
            console.error("[PasswordStep] Previous navigation failed:", err);
          }
        }}
        onSubmit={submitPassword}
        validate={validatePassword}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
