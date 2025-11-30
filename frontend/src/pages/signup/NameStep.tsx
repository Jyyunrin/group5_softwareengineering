/**
 * This page is a part of sign up.
 */
import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function NameStep({ onNext, onPrev }: StepProps) {
  const [username, setUserName] = React.useState("");
  const { update, data } = useSignup() ?? {};

  React.useEffect(() => {
    try {
      if (data?.name) setUserName(data.name);
    } catch (err) {
      console.error("[NameStep] Failed to initialize username:", err);
    }
  }, [data?.name]);

  const validateName = (s: string) => {
    if (!s) return "Please enter your name.";
    if (s.trim().length < 2) return "Name must be at least 2 characters.";
    return null;
  };

  const submitName = async (cleanName: string) => {
    try {
      if (!cleanName || cleanName.trim().length < 2) {
        throw new Error("Please enter a valid name before continuing.");
      }

      if (typeof update !== "function") {
        console.error("[NameStep] Signup context not ready — cannot update username.");
        alert("Signup system not ready. Please refresh and try again.");
        return;
      }
      let name = cleanName.trim()
      await Promise.resolve(update({ name: name }));
      onNext?.();
    } catch (err) {
      console.error("[NameStep] Failed to submit name:", err);
      alert((err as Error).message || "An error occurred while submitting your name.");
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Name?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={username}
        onChange={(v) => {
          try {
            setUserName(v);
          } catch (err) {
            console.error("[NameStep] Failed to update username state:", err);
          }
        }}
        inputName="username"
        placeholder="Your Name"
        autoComplete="username"
        onPrevious={() => {
          try {
            onPrev?.();
          } catch (err) {
            console.error("[NameStep] Previous navigation failed:", err);
          }
        }}
        onSubmit={submitName}
        validate={validateName}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
