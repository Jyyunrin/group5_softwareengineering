import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

/** A single guide step */
type Step = {
  id: string;
  /** CSS selector for the element to spotlight */
  selector: string;
  /** What the callout shows */
  title: string;
  body?: string;
  /** Where to place the callout relative to the spotlight */
  placement?: "top" | "bottom" | "left" | "right";
  /** Optional pixel nudges for fine-tuning */
  offset?: { x?: number; y?: number };
  /** Spotlight corner radius */
  radius?: number;
};

function useElementRect(selector: string, deps: any[] = []) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }

    const measure = () => {
      const r = el.getBoundingClientRect();
      setRect(r);
    };

    measure();

    // Re-measure on scroll/resize to keep spotlight aligned
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.concat([selector]));

  return rect;
}

/**
 * A full-screen overlay that punches a rounded-rect "hole" (spotlight)
 * and renders a callout near it. No external libs; pure SVG mask.
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
  // Safe fallbacks if the element isn't found yet
  const r = rect ?? new DOMRect(24, 120, 280, 90);

  // Create an SVG mask that makes a transparent hole where the spotlight is.
  const maskId = "quick-guide-mask";

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] pointer-events-auto"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id={maskId}>
            {/* Start by hiding nothing (black), then paint white everywhere, then "cut" the hole by painting black over the rounded rect. */}
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
        {/* Optional highlight ring */}
        <rect
          x={r.x - 4}
          y={r.y - 4}
          width={r.width + 8}
          height={r.height + 8}
          rx={radius + 6}
          ry={radius + 6}
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
}

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
  placement?: "top" | "bottom" | "left" | "right";
  offset?: { x?: number; y?: number };
}) {
  const r = rect ?? new DOMRect(24, 120, 280, 90);

  // Base position (next to spotlight)
  let top = r.y;
  let left = r.x;

  const GAP = 16; // space between spotlight and callout

  if (placement === "bottom") top = r.y + r.height + GAP;
  if (placement === "top") top = r.y - GAP;
  if (placement === "left") left = r.x - GAP;
  if (placement === "right") left = r.x + r.width + GAP;

  // Adjust to keep entirely visible if possible
  top = Math.max(16, top);
  left = Math.max(16, left);

  // Apply nudges
  if (offset?.x) left += offset.x;
  if (offset?.y) top += offset.y;

  return createPortal(
    <div
      className="fixed z-[1010] max-w-[min(90vw,460px)]"
      style={{ top, left }}
    >
      <div className="rounded-2xl bg-white shadow-2xl p-5">
        <div className="text-2xl font-extrabold tracking-tight mb-2">
          {title}
        </div>
        {body && <div className="text-gray-600">{body}</div>}
      </div>
    </div>,
    document.body
  );
}

export default function QuickGuide() {
  const navigate = useNavigate();

  // Define the steps you want to show. These refer to elements on your Landing page.
  const steps: Step[] = useMemo(
    () => [
      {
        id: "welcome",
        selector: "[data-guide='welcome-title']",
        title: "Welcome to FANGO 👋",
        body:
          "This is your home base. We’ll show you the fastest way to start learning and track progress.",
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
        body:
          "Revisit saved words and images. Great for quick review before a session.",
        placement: "top",
        radius: 20,
      },
      {
        id: "camera-fab",
        selector: "[data-guide='camera-fab']",
        title: "Camera Translate",
        body:
          "Point the camera at text to translate instantly. We’ll save results to your history.",
        placement: "left",
        radius: 36,
        offset: { x: -8 },
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const step = steps[index];

  // Measure the current target
  const rect = useElementRect(step.selector, [index]);

  const finish = () => window.location.replace("http://localhost:3000/landing");

  // Keyboard shortcuts for quick testing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  return (
    <>
      {/* Backdrop + spotlight */}
      <SpotlightOverlay rect={rect} radius={step.radius ?? 20}>
        {/* Click outside = advance */}
        <button
          className="absolute inset-0 w-full h-full cursor-default"
          aria-label="Background"
          onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
          style={{ background: "transparent", border: "none" }}
        />
      </SpotlightOverlay>

      {/* Callout bubble */}
      <Callout
        rect={rect}
        title={step.title}
        body={step.body}
        placement={step.placement}
        offset={step.offset}
      />

      {/* Controls */}
      {createPortal(
        <div className="fixed z-[1020] inset-x-0 bottom-6 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white shadow-xl px-3 py-2">
            <button
              className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
            >
              Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {index < steps.length - 1 ? (
              <>
                <button
                  className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100"
                  onClick={finish}
                >
                  Skip
                </button>
                <button
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                  onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                >
                  Next
                </button>
              </>
            ) : (
              <button
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                onClick={finish}
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
