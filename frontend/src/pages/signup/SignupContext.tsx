/**
 * This page contains data type for sign up and handle data.
 */
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type SignupData = {
  username?: string;
  email?: string;
  password?: string;
  targetLan?: string;
  goals?: string[];
  difficulty?: string;
};

type SignupCtx = {
  data: SignupData;
  update: (patch: Partial<SignupData>) => void;
  reset: () => void;
};

const Ctx = createContext<SignupCtx | null>(null);
const LS_KEY = "signup_wizard_draft_v1";

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        console.warn("SignupProvider: Invalid localStorage format, resetting");
        return {};
      }

      return parsed;
    } catch (err) {
      console.error("SignupProvider: Failed to parse localStorage", err);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("SignupProvider: Failed to write to localStorage", err);
    }
  }, [data]);

  const value = useMemo<SignupCtx>(
    () => ({
      data,

      update: (patch) => {
        try {
          if (!patch || typeof patch !== "object") {
            console.error("SignupProvider.update: Invalid patch", patch);
            return;
          }

          setData((d) => {
            const next = { ...d, ...patch };

            // basic corruption guard
            if (Array.isArray(next) || typeof next !== "object") {
              console.error("SignupProvider.update: Produced invalid state", next);
              return d;
            }

            return next;
          });
        } catch (err) {
          console.error("SignupProvider.update: Failed", err);
        }
      },

      reset: () => {
        try {
          setData({});
          localStorage.removeItem(LS_KEY);
        } catch (err) {
          console.error("SignupProvider.reset: Failed to clear", err);
          setData({});
        }
      },
    }),
    [data]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSignup() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSignup must be used inside <SignupProvider>");
  return ctx;
}
