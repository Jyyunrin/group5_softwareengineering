/**
 * Includes animation effects for smooth transitions.
 * This page takes only difficulty for quiz
 * 
 * TODO:
 * Connect with DB
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import SingleCheckbox from "../../components/checkbox/SingleCheckbox";

export default function SignUpDifficulty() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = React.useState<string | null>(null);

  const options = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const validate = (val: string) =>
    !val ? "Please select one difficulty." : null;

  const submitDifficulty = async (cleanValue: string) => {
    // TODO: send to backend if needed

    const redirect = "http://localhost:3000/signup/allset";
    window.location.replace(redirect);
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Level?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <SingleCheckbox
        value={difficulty}
        onChange={setDifficulty}
        options={options}
        inputName="learning-difficulty"
        onPrevious={() => navigate(-1)}
        onSubmit={submitDifficulty}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
