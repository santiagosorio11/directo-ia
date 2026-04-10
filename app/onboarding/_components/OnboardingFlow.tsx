"use client";

import { useOnboarding } from "@/app/onboarding/_context/OnboardingContext";
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
import { ProgressBar } from "./ui/ProgressBar";
import { ChevronLeft, ArrowRight, Loader2 } from "lucide-react";

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
  const { currentStep, nextStep, prevStep, isProcessing, customNextHandler, canNext } = useOnboarding();
  const [direction, setDirection] = useState(0);
  const [prevStepIdx, setPrevStepIdx] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentStep > prevStepIdx) {
      setDirection(1);
    } else if (currentStep < prevStepIdx) {
      setDirection(-1);
    }
    setPrevStepIdx(currentStep);
  }, [currentStep, prevStepIdx]);

  const showBackButton = currentStep > 0 && currentStep < 7;
  const showContinueButton = currentStep < 7;
  const continueText = currentStep === 6 ? "Activar mi Agente IA" : "Continuar";

  return (
    <div className="flex-1 w-full bg-background relative flex flex-col items-center min-h-screen font-sans">
      
      {/* Container Fijo para Progreso */}
      <div className="w-full max-w-4xl px-4 md:px-6 mt-4 md:mt-6 z-20">
        <ProgressBar currentStep={currentStep} totalSteps={7} />
      </div>

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
          className="w-full h-full flex flex-col items-center flex-1"
        >
          <div className="w-full max-w-4xl px-4 md:px-6 pb-32 pt-4">
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

      {/* Navegación Fija Inferior */}
      {showContinueButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-foreground/5 p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              {showBackButton && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest group"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground/[0.03] group-hover:bg-primary/10 flex items-center justify-center transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  Atrás
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (customNextHandler) {
                  customNextHandler();
                } else {
                  nextStep();
                }
              }}
              disabled={isProcessing || !canNext}
              className="flex items-center justify-center gap-3 px-8 py-3 bg-primary text-white rounded-full font-extrabold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {continueText}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
