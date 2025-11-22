/**
 * This page is the end of sign up.
 */
import { useEffect } from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import { useSignup } from "../signup/SignupContext";

export default function SignUpAllSet() {
  const { data, reset } = useSignup();

  useEffect(() => {
    let cancelled = false;

    const submitAll = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), 
          credentials: "include",
        });

        if (!res.ok) throw new Error("Signup failed");
        await res.json().catch(() => ({}));

        if (!cancelled) {
          reset(); 

          window.location.href = "http://localhost:3000/?guide=1";
        }
      } catch (e) {
        console.error(e);
        console.error("Could not complete signup. Please try again.");
      }
    };

    submitAll();
    return () => {
      cancelled = true;
    };
  }, [data, reset]);

  return (
    <SpringMotionLayout
      titleLines={[`${data.username || "User"},`, "You're", "All Set!"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <p>Finishing your account…</p>
      <p className="text-sm text-gray-500">Launching a quick tour next.</p>
    </SpringMotionLayout>
  );
}
