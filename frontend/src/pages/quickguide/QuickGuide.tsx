/**
 * QuickGuide – interactive onboarding spotlight tour
 * Added robust error handling for DOM queries, rendering, and events.
 */

import React, { useEffect, useLayoutEffect, useMemo, useState, useId } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";

type Placement = "top" | "bottom" | "left" | "right";

type Step = {
  id: string;
  selector: string;
  title: string;
  body?: string;
  placement?: Placement;
  offset?: { x?: number; y?: number };
  radius?: number;
};

const GAP = 16;
const DEFAULT_RECT = new DOMRect(24, 120, 280, 90);

/**
 * Hook: safely measure an element’s bounding box.
 * Includes try/catch and graceful degradation if element not found.
 */
function useElementRect(selector: string, deps: React.DependencyList = []) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return;

      const el = document.querySelector<HTMLElement>(selector);
      if (!el) {
        console.warn(`[QuickGuide] Element not found for selector: ${selector}`);
        setRect(null);
        return;
      }

      let frame = 0;
      const measure = () => {
        try {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
        } catch (err) {
          console.error("[QuickGuide] Failed to measure element:", err);
        }
      };

      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      measure();

      const ro = new ResizeObserver(() => measure());
      ro.observe(el);

      const onScroll = () => measure();
      const onResize = () => measure();

      window.addEventListener("scroll", onScroll, { capture: true, passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onResize);
      };
    } catch (err) {
      console.error("[QuickGuide] useElementRect error:", err);
      setRect(null);
    }
  }, [selector, ...deps]);

  return rect;
}

/**
 * Spotlight overlay mask with safe rendering and fallback.
 */
function SpotlightOverlay({
  rect,
  radius = 20,
  children,
}: {
  rect: DOMRect | null;
  radius?: number;
  children?: React.ReactNode;
}) {
  const maskSuffix = useId().replace(/:/g, "");
  const maskId = `quick-guide-mask-${maskSuffix}`;
  const r = rect ?? DEFAULT_RECT;

  try {
    return createPortal(
      <div className="fixed inset-0 z-[1000] pointer-events-auto" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={r.x}
                y={r.y}
                rx={radius}
                ry={radius}
                width={r.width}
                height={r.height}
                fill="black"
              />
            </mask>
          </defs>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask={`url(#${maskId})`}
          />

          <rect
            x={r.x - 4}
            y={r.y - 4}
            width={r.width + 8}
            height={r.height + 8}
            rx={(radius ?? 20) + 6}
            ry={(radius ?? 20) + 6}
            fill="none"
            stroke="white"
            strokeOpacity="0.9"
            strokeWidth="2"
          />
        </svg>

        {children}
      </div>,
      document.body
    );
  } catch (err) {
    console.error("[QuickGuide] SpotlightOverlay render error:", err);
    return null;
  }
}

/**
 * Tooltip-like callout for text and descriptions
 */
function Callout({
  rect,
  title,
  body,
  placement = "bottom",
  offset,
}: {
  rect: DOMRect | null;
  title: string;
  body?: string;
  placement?: Placement;
  offset?: { x?: number; y?: number };
}) {
  const r = rect ?? DEFAULT_RECT;

  let top = r.y;
  let left = r.x;

  if (placement === "bottom") top = r.y + r.height + GAP;
  if (placement === "top") top = r.y - GAP;
  if (placement === "left") left = r.x - GAP;
  if (placement === "right") left = r.x + r.width + GAP;

  top = Math.max(16, top + (offset?.y ?? 0));
  left = Math.max(16, left + (offset?.x ?? 0));

  try {
    return createPortal(
      <div
        className="fixed z-[1010] max-w-[min(90vw,460px)]"
        style={{ top, left }}
        role="dialog"
        aria-live="polite"
      >
        <div className="rounded-2xl bg-white shadow-2xl p-5">
          <div className="text-2xl font-extrabold tracking-tight mb-2">{title}</div>
          {body && <div className="text-gray-600">{body}</div>}
        </div>
      </div>,
      document.body
    );
  } catch (err) {
    console.error("[QuickGuide] Callout render error:", err);
    return null;
  }
}

/**
 * Main QuickGuide component
 */
export default function QuickGuide() {
  const [params, setParams] = useSearchParams();

  const steps: Step[] = useMemo(
    () => [
      {
        id: "welcome",
        selector: "[data-guide='welcome-title']",
        title: "Welcome to FANGO 👋",
        body: "This is your home base. We’ll show you the fastest way to start learning and track progress.",
        placement: "bottom",
        radius: 14,
        offset: { y: 8 },
      },
      {
        id: "target-language",
        selector: "[data-guide='target-language']",
        title: "Pick your target language",
        body: "Tap here anytime to change the language you’re learning.",
        placement: "bottom",
        radius: 12,
      },
      {
        id: "daily-quiz",
        selector: "[data-guide='daily-quiz-card']",
        title: "Tap here to take Daily Quiz",
        body: "Short, focused practice. Earn streaks and build your stack.",
        placement: "bottom",
        radius: 24,
      },
      {
        id: "likes-history",
        selector: "[data-guide='likes-history']",
        title: "Your Likes & Search History",
        body: "Revisit saved words and images for quick review.",
        placement: "top",
        radius: 20,
      },
      {
        id: "camera-fab",
        selector: "[data-guide='camera-fab']",
        title: "Camera Translate",
        body: "Point the camera at text to translate instantly.",
        placement: "top",
        radius: 36,
        offset: { y: -100 },
      },
    ],
    []
  );

  const [index, setIndex] = useState(() => {
    const start = Number(params.get("guideStep"));
    return isNaN(start) ? 0 : Math.min(Math.max(start, 0), steps.length - 1);
  });

  const step = steps[index];
  const rect = useElementRect(step.selector, [index]);
  const finish = () => {
    try {
      setParams({});
    } catch (err) {
      console.error("[QuickGuide] Failed to finish:", err);
    }
  };

  // Keyboard navigation with safety guard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      try {
        if (e.key === "Escape") finish();
        else if (e.key === "ArrowRight")
          setIndex((i) => Math.min(i + 1, steps.length - 1));
        else if (e.key === "ArrowLeft")
          setIndex((i) => Math.max(i - 1, 0));
      } catch (err) {
        console.error("[QuickGuide] Keyboard handler error:", err);
      }
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  return (
    <>
      <SpotlightOverlay rect={rect} radius={step.radius ?? 20}>
        <button
          className="absolute inset-0 w-full h-full cursor-default"
          aria-label="Background"
          onClick={() => {
            try {
              setIndex((i) => Math.min(i + 1, steps.length - 1));
            } catch (err) {
              console.error("[QuickGuide] Button click error:", err);
            }
          }}
          style={{ background: "transparent", border: "none" }}
        />
      </SpotlightOverlay>

      <Callout
        rect={rect}
        title={step.title}
        body={step.body}
        placement={step.placement}
        offset={step.offset}
      />

      {createPortal(
        <div className="fixed z-[1020] inset-x-0 bottom-6 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white shadow-xl px-3 py-2">
            <button
              className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
              onClick={() => {
                try {
                  setIndex((i) => Math.max(i - 1, 0));
                } catch (err) {
                  console.error("[QuickGuide] Back button error:", err);
                }
              }}
              disabled={index === 0}
            >
              Back
            </button>

            <div className="flex items-center gap-1.5" aria-hidden="true">
              {steps.map((_, i) => (
                <span
                  key={_.id}
                  className={`h-2 w-2 rounded-full ${i === index ? "bg-gray-900" : "bg-gray-300"}`}
                />
              ))}
            </div>

            {index < steps.length - 1 ? (
              <>
                <button
                  className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100"
                  onClick={() => {
                    try {
                      finish();
                    } catch (err) {
                      console.error("[QuickGuide] Skip button error:", err);
                    }
                  }}
                >
                  Skip
                </button>
                <button
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                  onClick={() => {
                    try {
                      setIndex((i) => Math.min(i + 1, steps.length - 1));
                    } catch (err) {
                      console.error("[QuickGuide] Next button error:", err);
                    }
                  }}
                >
                  Next
                </button>
              </>
            ) : (
              <button
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                onClick={() => {
                  try {
                    finish();
                  } catch (err) {
                    console.error("[QuickGuide] Done button error:", err);
                  }
                }}
              >
                Done
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
