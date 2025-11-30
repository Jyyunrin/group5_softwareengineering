/**
 * This page is a part of sign up.
 */
import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function EmailStep({ onNext, onPrev }: StepProps) {
  const [email, setEmail] = React.useState("");
  const { update, data } = useSignup() ?? {};

  React.useEffect(() => {
    try {
      if (data?.email) setEmail(data.email);
    } catch (err) {
      console.error("[EmailStep] Failed to initialize email:", err);
    }
  }, [data?.email]);

  const validateEmail = (s: string) => {
    if (!s) return "Please enter your email.";

    const hasAt = s.indexOf("@") > 0;
    const hasDotAfterAt = s.lastIndexOf(".") > s.indexOf("@") + 1;
    return hasAt && hasDotAfterAt ? null : "Please enter a valid email.";
  };

  const submitEmail = async (cleanEmail: string) => {
    try {
      if (!cleanEmail) throw new Error("Email is empty.");

      if (typeof update !== "function") {
        console.error("[EmailStep] Signup context not ready — cannot update email.");
        alert("Signup not ready. Please refresh and try again.");
        return;
      }

      await Promise.resolve(update({ email: cleanEmail }));
      onNext?.();
    } catch (err) {
      console.error("[EmailStep] Failed to submit email:", err);
      alert((err as Error).message || "An error occurred while submitting your email.");
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Email?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={email}
        onChange={(v) => {
          try {
            setEmail(v);
          } catch (err) {
            console.error("[EmailStep] Failed to update email state:", err);
          }
        }}
        inputName="email"
        placeholder="your@email.com"
        autoComplete="email"
        onPrevious={() => {
          try {
            onPrev?.();
          } catch (err) {
            console.error("[EmailStep] Previous navigation failed:", err);
          }
        }}
        onSubmit={submitEmail}
        validate={validateEmail}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
