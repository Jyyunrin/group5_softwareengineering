/**
 * This page defines sing up step components and gives signup layout.
 */
import { useState } from "react";
import type { ComponentType } from "react";
import type { StepProps } from "./Types";
import NameStep from "./NameStep";
import PasswordStep from "./PasswordStep";
import SetUpTargetLan from "./SetUpTargetLan";
import SignUpGoal from "./SignUpGoal";
import SignUpDifficulty from "./SignUpDifficulty";
import SignUpAllSet from "./SignUpAllSet";

const steps: ComponentType<StepProps>[] = [
  NameStep,
  PasswordStep,
  SetUpTargetLan,
  SignUpGoal,
  SignUpDifficulty,
  SignUpAllSet,
];

export default function SignupLayout() {
  const [stepIndex, setStepIndex] = useState(0);
  const StepComponent = steps[stepIndex];

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div>
      <StepComponent onNext={next} onPrev={prev} />
    </div>
  );
}
