"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface OnboardingData {
  // Step 0: Registration
  email: string;
  phone: string;
  address: string;
  
  // Step 1: Identity
  businessName: string;
  foodType: string;
  schedule: string;
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
  phone: "",
  address: "",
  businessName: "",
  foodType: "",
  schedule: "",
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
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children, initialStep = 0, initialEmail = "" }: { children: ReactNode, initialStep?: number, initialEmail?: string }) {
  const [data, setData] = useState<OnboardingData>({
    ...defaultData,
    email: initialEmail || defaultData.email
  });
  const [currentStep, setCurrentStep] = useState(initialStep); 
  const [isProcessing, setIsProcessing] = useState(false);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const setStep = (step: number) => setCurrentStep(step);

  return (
    <OnboardingContext.Provider value={{ data, updateData, currentStep, nextStep, prevStep, setStep, isProcessing, setIsProcessing }}>
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
