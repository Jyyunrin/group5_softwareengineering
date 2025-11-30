/**
 * Bottom navigation page with buttons.
 * Route controls: main.tsx 
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Camera, Home, BookOpen, UploadCloud, User, Settings } from "lucide-react";

type Item = { to: string; label: string; icon: React.ReactNode };

const items: Item[] = [
  { to: "/user/userinfo", label: "Profile", icon: <User size={18} /> },
  { to: "/translation/camera", label: "Upload", icon: <UploadCloud size={18} /> },
  { to: "/", label: "Home", icon: <Home size={18} /> }, 
  { to: "/user/userhistory", label: "History", icon: <BookOpen size={18} /> },
  { to: "/user/userlearninginfo", label: "Settings", icon: <Settings size={18} /> },
];

export default function BottomRadialNav() {
  const navigate = useNavigate();

  const start = 180; 
  const end = 0; 
  const radius = 90; 

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={false}
    >
      <div className="relative mx-auto h-[200px] w-[360px]">
        <div className="absolute left-1/2 top-[60%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-black/35 via-black/10 to-transparent blur-2xl" />

        {/* Items */}
        {items.map((it, i) => {
          const angle =
            items.length === 1 ? 0 : start + (i * (end - start)) / (items.length - 1);
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                [
                  "pointer-events-auto absolute grid h-14 w-14 place-items-center rounded-full shadow-lg",
                  "bg-white text-gray-700 ring-1 ring-black/5",
                  isActive ? "scale-105" : "opacity-90 hover:opacity-100",
                ].join(" ")
              }
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(70% - ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label={it.label}
            >
              {it.icon}
            </NavLink>
          );
        })}

        {/* Center Action ( Open camera right away ) */}
        <button
          type="button"
          onClick={() => navigate("/translation/camera")}
          className="pointer-events-auto absolute left-1/2 top-[72%] grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue-500 text-white shadow-2xl ring-4 ring-white"
          aria-label="Open Camera"
        >
          <Camera size={34} />
        </button>
      </div>
    </div>
  );
}
