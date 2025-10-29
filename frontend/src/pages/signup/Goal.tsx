/**
 * Includes animation effects for smooth transitions.
 * This page takes only user's learning goal.
 * Multiple choices are available.
 * 
 * TODO:
 * Connect with DB
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import MultiCheckbox from "../../components/checkbox/MultiCheckbox";

export default function SignUpGoal() {
  const navigate = useNavigate();
  const [goals, setGoals] = React.useState<string[]>([]);

  const options = [
    { label: "Image Translation", value: "image-translation" },
    { label: "Travel", value: "travel" },
    { label: "Work", value: "work" },
    { label: "Study", value: "study" },
    { label: "Etc(s)", value: "etc" },
  ];

  const validate = (vals: string[]) =>
    vals.length === 0 ? "Please select at least one goal." : null;

  const submitGoal = async (cleanValues: string[]) => {
    // TODO: send to backend 

    // continue to next step for a now
    const redirect = "http://localhost:3000/signup/difficulty";
    window.location.replace(redirect);
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Learning Goal?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <MultiCheckbox
        values={goals}
        onChange={setGoals}
        options={options}
        inputName="learning-goals"
        onPrevious={() => navigate(-1)}
        onSubmit={submitGoal}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
