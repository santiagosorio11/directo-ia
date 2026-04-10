"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-1.5 h-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 h-full rounded-full bg-black/[0.05] relative overflow-hidden"
          >
            {i <= currentStep && (
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                className="absolute inset-0 bg-[#052125]"
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start text-[10px] font-bold tracking-wider text-black/40">
        <span>Paso {currentStep + 1} de {totalSteps}</span>
      </div>
    </div>
  );
}
