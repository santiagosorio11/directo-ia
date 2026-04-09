"use client";

import { useOnboarding } from "@/app/context/OnboardingContext";
import { AnimatePresence, motion } from "framer-motion";
import { AuthStep } from "./steps/AuthStep";
import { RegistrationStep } from "./steps/RegistrationStep";
import { IdentityStep } from "./steps/IdentityStep";
import { MenuOCRStep } from "./steps/MenuOCRStep";
import { StrategyStep } from "./steps/StrategyStep";
import { PersonalityStep } from "./steps/PersonalityStep";
import { OperationStep } from "./steps/OperationStep";
import { SuccessStep } from "./steps/SuccessStep";
import { useEffect, useState } from "react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function OnboardingFlow() {
  const { currentStep } = useOnboarding();
  const [direction, setDirection] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  useEffect(() => {
    console.log("OnboardingFlow mount/update - currentStep:", currentStep);
  }, [currentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentStep > prevStep) {
      setDirection(1);
    } else if (currentStep < prevStep) {
      setDirection(-1);
    }
    setPrevStep(currentStep);
  }, [currentStep, prevStep]);

  return (
    <div className="flex-1 w-full bg-background relative flex flex-col items-center min-h-screen">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 32 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full flex flex-col items-center"
        >
          <div className="w-full max-w-4xl px-4 md:px-6">
            {currentStep === 0 && <AuthStep />}
            {currentStep === 1 && <RegistrationStep />}
            {currentStep === 2 && <IdentityStep />}
            {currentStep === 3 && <MenuOCRStep />}
            {currentStep === 4 && <StrategyStep />}
            {currentStep === 5 && <PersonalityStep />}
            {currentStep === 6 && <OperationStep />}
            {currentStep === 7 && <SuccessStep />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
