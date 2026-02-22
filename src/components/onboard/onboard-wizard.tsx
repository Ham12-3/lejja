"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardHeader } from "./onboard-header";
import { ProgressStepper } from "./progress-stepper";
import { StepConnect } from "./step-connect";
import { StepConfigure } from "./step-configure";
import { StepSync } from "./step-sync";
import type { ConfigureFormData } from "@/lib/schemas/onboard";

const stepTitles = ["Connect Platform", "Configure Book", "Initial Sync"];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function OnboardWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [configData, setConfigData] = useState<ConfigureFormData>({
    clientName: "",
    email: "",
    verticals: [],
    aiCategorization: false,
    anomalyScanning: true,
  });

  function goNext() {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardHeader stepTitle={stepTitles[currentStep - 1]} />
      <ProgressStepper currentStep={currentStep} />

      <main className="flex-1 flex items-start justify-center px-6 pb-16 pt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {currentStep === 1 && (
              <StepConnect
                selected={selectedPlatform}
                onSelect={setSelectedPlatform}
                onNext={goNext}
                onCancel={() => router.push("/")}
              />
            )}
            {currentStep === 2 && (
              <StepConfigure
                data={configData}
                onChange={setConfigData}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && <StepSync />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
