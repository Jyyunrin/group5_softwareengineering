/**
 * This page is a part of sign up.
 */
import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import MultiCheckbox from "../../components/checkbox/MultiCheckbox";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";
import { options } from "../../components/goals/options"

export default function SignUpGoal({ onNext, onPrev }: StepProps) {
  const { update, data } = useSignup();
  const [goals, setGoals] = React.useState<string[]>(() => {
    try {
      return data?.goals ?? [];
    } catch (err) {
      console.error("SignUpGoal: Failed initial goals state:", err);
      return [];
    }
  });

  React.useEffect(() => {
    try {
      if (data?.goals) setGoals(data.goals);
    } catch (err) {
      console.error("SignUpGoal useEffect error:", err);
    }
  }, [data?.goals]);


  const validate = (vals: string[]) => {
    try {
      return vals.length === 0 ? "Please select at least one goal." : null;
    } catch (err) {
      console.error("SignUpGoal validation error:", err);
      return "Unexpected validation error.";
    }
  };

  const submitGoal = async (cleanValues: string[]) => {
    try {
      update({ goals: cleanValues });
      onNext();
    } catch (err) {
      console.error("SignUpGoal: Failed to submit goals:", err);
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Learning Goal?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <MultiCheckbox
        values={goals}
        onChange={(val) => {
          try {
            setGoals(val);
          } catch (err) {
            console.error("SignUpGoal: Failed to update goals state:", err);
          }
        }}
        options={options}
        inputName="learning-goals"
        onPrevious={onPrev}
        onSubmit={submitGoal}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
