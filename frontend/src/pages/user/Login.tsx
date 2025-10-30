/**
 * The very first page that user will see
 * 
 * TODO:
 * Implement user database 
 * Find a proper mascot image
 * Adjust input form a bit higher
 */
import { motion } from "framer-motion";
import { useState } from "react";
import bcrypt from "bcryptjs";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
      const [id, setId] = useState("");
      const [pw, setPw] = useState("");
      const [showPw, setShowPw] = useState(false);
    
      // to backend team: please replace with auth call
      const attemptLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    
        const salt = bcrypt.genSaltSync(10)
        
        const hashedPassword = bcrypt.hashSync(event.currentTarget.password.value, '$2a$10$CwTycUXWue0Thq9StjUM0u'); 
        // hash created previously created upon sign up
    
        let formData = {
            "email": event.currentTarget.email.value,
            "password": event.currentTarget.password.value
        }
        const jsonData = JSON.stringify(formData)
    
        // TODO: CHANGE THIS URL
        const data = await fetch(import.meta.env.VITE_SERVER_URL + "/login", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: jsonData,
            credentials: 'include'
        });
    
        const upload_response = await data.json();
        if (upload_response['success'] == true) {
            console.log("Successful login attempt");
            window.location.replace(import.meta.env.VITE_REDIRECT_URL)
        } else {
            console.log("Error Found");
            alert("Login failed");
        }
      }
      
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <img
        src="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff" 
        alt=""
        className="pointer-events-none select-none absolute -bottom-8 -left-8 w-[65vw] max-w-sm object-cover opacity-90"
      />

      {/* LOGO — starts centered, springs to top */}
      <motion.h1
        initial={{ y: 0, scale: 1, opacity: 1 }}
        animate={{ y: "-32vh", scale: 0.88, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 text-6xl font-extrabold tracking-tight"
      >
        FANGO
      </motion.h1>

      {/* Buttons — fade/slide in after the logo moves */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 flex w-64 flex-col items-center gap-4"
      >
        {/* Form */}
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

          {/* Password with show/hide */}
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
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          {/* Sign In & Sign Up Buttons*/}
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
              onClick={() => window.location.replace("http://localhost:3000/register")} 
            >
              Sign Up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
