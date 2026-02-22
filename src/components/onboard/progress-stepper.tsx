"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Connect Platform", number: 1 },
  { label: "Configure Book", number: 2 },
  { label: "Initial Sync", number: 3 },
];

interface ProgressStepperProps {
  currentStep: number;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 py-8 px-6">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  isCompleted &&
                    "bg-accent-green text-[#0f111a]",
                  isActive &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted &&
                    !isActive &&
                    "bg-surface-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && "text-foreground",
                  isCompleted && "text-accent-green",
                  !isCompleted && !isActive && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-px mx-4 transition-colors duration-300",
                  currentStep > step.number
                    ? "bg-accent-green"
                    : "bg-surface-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
