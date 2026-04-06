"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-border/40 z-[100] overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-r-full shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </div>
  );
}
