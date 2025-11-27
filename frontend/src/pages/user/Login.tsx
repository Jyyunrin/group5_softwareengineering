/**
 * The very first page that user visit the webste.
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const attemptLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);

    try {
      const email = event.currentTarget.email?.value;
      const password = event.currentTarget.password?.value;

      if (!email || !password) {
        setErrorMsg("Email and password are required.");
        return;
      }

      // let hashedPassword = "";
      // try {
      //   hashedPassword = bcrypt.hashSync(
      //     password,
      //     "$2a$10$CwTycUXWue0Thq9StjUM0u"
      //   );
      // } catch (err) {
      //   console.error("Password hashing failed:", err);
      //   setErrorMsg(`Failed to process password. Try again.`);
      //   return;
      // }

      let jsonData = "";
      try {
        jsonData = JSON.stringify({
          email,
          password: password,
        });
      } catch (err) {
        console.error("JSON stringify failed:", err);
        setErrorMsg("Failed to process login data.");
        return;
      }

      let response: Response;
      try {
        response = await fetch(
          import.meta.env.VITE_SERVER_URL + "/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: jsonData,
          }
        );
      } catch (err) {
        console.error("Network error:", err);
        setErrorMsg("Unable to reach server. Check your network.");
        return;
      }

      let upload_response: any;
      try {
        upload_response = await response.json();
      } catch (err) {
        console.error("Error parsing server response:", err);
        setErrorMsg("Invalid response from server.");
        return;
      }

      if (upload_response?.success === true) {
        try {
          window.location.replace(import.meta.env.VITE_REDIRECT_URL);
        } catch (err) {
          console.error("Navigation error:", err);
          setErrorMsg("Login succeeded, but redirect failed.");
        }
      } else {
        console.error("Login failed:", upload_response);
        setErrorMsg("Invalid email or password.");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setErrorMsg("Unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <img
        src="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
        alt=""
        className="pointer-events-none select-none absolute -bottom-8 -left-8 w-[65vw] max-w-sm object-cover opacity-90"
      />

      {/* LOGO */}
      <motion.h1
        initial={{ y: 0, scale: 1, opacity: 1 }}
        animate={{ y: "-32vh", scale: 0.88, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 text-6xl font-extrabold tracking-tight"
      >
        FANGO
      </motion.h1>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 flex w-64 flex-col items-center gap-4"
      >
        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="w-full rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-700 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={attemptLogin} className="space-y-4">
          {/* ID */}
          <label className="block">
            <span className="sr-only">ID</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Email"
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 mb-2 outline-none ring-0 focus:border-blue-500"
              autoComplete="username"
              name="email"
              required
            />
          </label>

          {/* Password */}
          <label className="block relative">
            <span className="sr-only">Password</span>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-11 outline-none focus:border-blue-500"
              autoComplete="current-password"
              name="password"
              required
            />

            <button
              type="button"
              onClick={() => {
                try {
                  setShowPw((v) => !v);
                } catch (err) {
                  console.error("Error toggling password visibility:", err);
                }
              }}
              className="absolute inset-y-0 right-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          {/* Sign In & Sign Up */}
          <div className="mt-4 items-center">
            <button
              type="submit"
              className="w-full rounded-full bg-gray-900 px-5 py-3 mb-2 text-center font-medium text-white shadow hover:bg-gray-800 active:translate-y-[1px]"
            >
              Sign In
            </button>

            <button
              type="button"
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-center font-medium text-gray-900 shadow hover:bg-gray-50 active:translate-y-[1px]"
              onClick={() => {
                try {
                  window.location.replace(import.meta.env.VITE_REDIRECT_URL + "signup")
                } catch (err) {
                  console.error("Error navigating to register:", err);
                  setErrorMsg("Failed to open registration page.");
                }
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
