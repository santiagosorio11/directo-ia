"use client";

import { motion } from "framer-motion";

export function VoiceWaveform({ isListening }: { isListening: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={
            isListening
              ? {
                  height: [12, 32, 16, 40, 12][i % 5],
                  opacity: [0.3, 1, 0.3][i % 3],
                }
              : { height: 12, opacity: 0.2 }
          }
          transition={
            isListening
              ? {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          className="w-1.5 bg-primary rounded-full"
          style={{ backgroundColor: "#b04218" }}
        />
      ))}
    </div>
  );
}
