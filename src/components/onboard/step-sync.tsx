"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./progress-ring";
import { ActivityLog, type LogEntry } from "./activity-log";

const syncSteps: string[] = [
  "Authenticating credentials",
  "Fetching chart of accounts",
  "Connecting to Codat",
  "Syncing transactions",
  "Running AI categorization",
  "Finalizing setup",
];

export function StepSync() {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const stepDuration = 2500;
    const tickInterval = 100;
    const totalSteps = syncSteps.length;
    const totalDuration = stepDuration * totalSteps;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += tickInterval;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(Math.round(pct));

      const step = Math.min(
        Math.floor(elapsed / stepDuration),
        totalSteps - 1
      );
      setActiveStep(step);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setComplete(true);
      }
    }, tickInterval);

    return () => clearInterval(timer);
  }, []);

  const entries: LogEntry[] = syncSteps.map((label, i) => ({
    label,
    status:
      i < activeStep
        ? "completed"
        : i === activeStep
          ? complete
            ? "completed"
            : "active"
          : "pending",
  }));

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Initial Sync in Progress
      </h2>
      <p className="text-muted-foreground text-sm mb-10">
        We&apos;re importing your financial data. This usually takes a few
        seconds.
      </p>

      {/* Progress ring */}
      <div className="relative mb-8">
        <ProgressRing progress={progress} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-foreground">
            {progress}%
          </span>
        </div>
      </div>

      {/* Activity log */}
      <ActivityLog entries={entries} />

      {/* Security badge */}
      <div className="flex items-center gap-2 mt-8 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-accent-green" />
        <span>Secure 256-bit TLS Connection Established</span>
      </div>

      {/* Go to Dashboard */}
      <div className="mt-10 pt-6 border-t border-border w-full flex justify-center">
        <Button asChild disabled={!complete} className="gap-2">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
