/**
 * Animated page layout for login / sign up.
 * Paried with TextInputStep.tsx
 */
import { motion } from "framer-motion";
import React from "react";

type SpringMotionLayoutProps = {
    titleLines: string[];
    imageSrc?: string;
    children: React.ReactNode;
};

export default function SpringMotionLayout({ titleLines, imageSrc, children }: SpringMotionLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white">
            {imageSrc && (
                <img
                src={imageSrc}
                alt=""
                className="pointer-events-none select-none absolute -bottom-8 -left-8 w-[65vw] max-w-sm object-cover opacity-90"
                />
            )}

            {/* Animated Text */}
            <motion.h1
                initial={{ y: 0, scale: 1, opacity: 1 }}
                animate={{ y: "-32vh", scale: 0.88, opacity: 1 }}
                transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.8 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 text-6xl font-extrabold tracking-tight text-gray-900"
                >
                {titleLines.map((line, idx) => (
                    <span key={idx} className="block">{line}</span>
                ))}
            </motion.h1>

            {/* Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 flex w-72 sm:w-80 flex-col items-center gap-4"
                >
                {children}
            </motion.div>
        </div>
    );
}
