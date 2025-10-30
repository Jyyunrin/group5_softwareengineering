/**
 * The final page from sign up
 * 
 * TODO:
 * Connect with DB
 * Add guideline logic
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";

export default function SignUpAllSet() {
  const navigate = useNavigate();


  const StartGuideLine = async (cleanValue: string) => {
    const redirect = "http://localhost:3000/signup/guideline";
    window.location.replace(redirect);
  };

  return (
    // Add dynamic username
    <SpringMotionLayout
      titleLines={["Username,", "You're", "All Set!"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >

    <p> Quick app tour guide will show up here </p>
    </SpringMotionLayout>
  );
}
