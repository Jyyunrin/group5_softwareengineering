/**
 * This page can be used for quiz difficulty in the future. (Out of scope)
 */
import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import SingleCheckbox from "../../components/checkbox/SingleCheckbox";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SignUpDifficulty({ onNext, onPrev }: StepProps) {
  const { update, data } = useSignup();
  const [difficulty, setDifficulty] = React.useState<string | null>(() => {
    try {
      return data?.difficulty ?? null;
    } catch (err) {
      console.error("Failed initializing difficulty state:", err);
      return null;
    }
  });

  React.useEffect(() => {
    try {
      if (data?.difficulty) setDifficulty(data.difficulty);
    } catch (err) {
      console.error("SignUpDifficulty useEffect error:", err);
    }
  }, [data?.difficulty]);

  const options = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const validate = (val: string | null) => {
    try {
      return !val ? "Please select one difficulty." : null;
    } catch (err) {
      console.error("Validation error in SignUpDifficulty:", err);
      return "Unexpected validation error.";
    }
  };

  const submitDifficulty = async (cleanValue: string) => {
    try {
      update({ difficulty: cleanValue });
      onNext();
    } catch (err) {
      console.error("Failed to submit difficulty:", err);
    }
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Level?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <SingleCheckbox
        value={difficulty}
        onChange={(v) => {
          try {
            setDifficulty(v);
          } catch (err) {
            console.error("Failed to set difficulty:", err);
          }
        }}
        options={options}
        inputName="learning-difficulty"
        onPrevious={onPrev}
        onSubmit={submitDifficulty}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
