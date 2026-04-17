"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface OnboardingData {
  // Step 0: Registration
  email: string;
  fullName: string;
  phone: string;
  address: string;
  
  // Step 1: Identity
  businessName: string;
  foodType: string;
  schedule: string;
  weeklySchedule: Record<string, { isOpen: boolean, openTime: string, closeTime: string }>;
  businessDescription: string;
  
  // Step 2: Menu OCR
  menuText: string; // Raw text from OCR
  menuFileName: string;
  menuProducts: any[]; // Structured products from n8n
  
  // Step 3: Strategy
  objectives: string[];
  starProduct: string;
  crossSelling: string;
  
  // Step 4: Personality
  tone: string;
  greeting: string;
  
  // Step 5: Operation
  prepTime: string;
  paymentMethods: string[];
  dishPolicies: string;
  
  // Final Result
  generatedSystemPrompt: string;
  agentName: string;
}

const defaultData: OnboardingData = {
  email: "",
  fullName: "",
  phone: "",
  address: "",
  businessName: "",
  foodType: "",
  schedule: "",
  weeklySchedule: {
    "Lunes": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Martes": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Miércoles": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Jueves": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Viernes": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Sábado": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
    "Domingo": { isOpen: true, openTime: "12:00", closeTime: "22:00" },
  },
  businessDescription: "",
  menuText: "",
  menuFileName: "",
  menuProducts: [],
  objectives: [],
  starProduct: "",
  crossSelling: "",
  tone: "Relajado",
  greeting: "¡Hola! Bienvenido a nuestro restaurante.",
  prepTime: "15-20 min",
  paymentMethods: ["Efectivo", "Online"],
  dishPolicies: "Se aceptan modificaciones sin costo extra",
  generatedSystemPrompt: "",
  agentName: "DirectoBot",
};

interface OnboardingContextProps {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  setCustomNextHandler: (handler: (() => void) | null) => void;
  customNextHandler: (() => void) | null;
  canNext: boolean;
  setCanNext: (val: boolean) => void;
  resetOnboarding: (skipAuth?: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children, initialStep = 0, initialEmail = "" }: { children: ReactNode, initialStep?: number, initialEmail?: string }) {
  const [data, setData] = useState<OnboardingData>({
    ...defaultData,
    email: initialEmail || defaultData.email
  });
  const [currentStep, setCurrentStep] = useState(initialStep); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [customNextHandler, setCustomNextHandler] = useState<(() => void) | null>(null);
  const [canNext, setCanNext] = useState(true);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const setStep = (step: number) => setCurrentStep(step);

  const resetOnboarding = (skipAuth: boolean = false) => {
    setData({
      ...defaultData,
      email: data.email // Preserve current email
    });
    setCurrentStep(skipAuth ? 1 : 0);
  };

  return (
    <OnboardingContext.Provider value={{ 
      data, 
      updateData, 
      currentStep, 
      nextStep, 
      prevStep, 
      setStep, 
      isProcessing, 
      setIsProcessing,
      customNextHandler,
      setCustomNextHandler,
      canNext,
      setCanNext,
      resetOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding debe estar en un OnboardingProvider");
  }
  return context;
}
