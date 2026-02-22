"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepConnectProps {
  selected: string | null;
  onSelect: (platform: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

const platforms = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    badge: "Connect in 30s",
    badgeColor: "bg-accent-green/15 text-accent-green border-accent-green/20",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <rect width="40" height="40" rx="10" fill="#2CA01C" />
        <path
          d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm-2.4 17.6c-2.2 0-4-1.8-4-4s1.8-4 4-4h1.2v2h-1.2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2v-1.2h2v1.2c0 2.2-1.8 4-4 4zm8.8-5.6c0 2.2-1.8 4-4 4h-1.2v-2h1.2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2v1.2h-2V20c0-2.2 1.8-4 4-4s4 1.8 4 4z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    id: "xero",
    name: "Xero",
    badge: "Certified Partner",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <rect width="40" height="40" rx="10" fill="#13B5EA" />
        <path
          d="M14.5 14.5l5.5 5.5m0 0l5.5-5.5M20 20l5.5 5.5M20 20l-5.5 5.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function StepConnect({
  selected,
  onSelect,
  onNext,
  onCancel,
}: StepConnectProps) {
  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Select Accounting Platform
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Connect your existing accounting software to get started.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => onSelect(platform.id)}
            className={cn(
              "glass-card flex flex-col items-center gap-4 rounded-xl p-6 text-center transition-all duration-200 cursor-pointer",
              selected === platform.id
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-white/15"
            )}
          >
            {platform.icon}
            <span className="text-sm font-semibold text-foreground">
              {platform.name}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                platform.badgeColor
              )}
            >
              {platform.badge}
            </span>
          </button>
        ))}
      </div>

      {/* CSV option */}
      <button
        type="button"
        onClick={() => onSelect("csv")}
        className={cn(
          "glass-card flex items-center gap-3 rounded-xl px-5 py-3 w-full transition-all duration-200 cursor-pointer",
          selected === "csv"
            ? "border-primary ring-2 ring-primary/20"
            : "hover:border-white/15"
        )}
      >
        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Import via CSV instead
        </span>
      </button>

      {/* Footer */}
      <div className="flex items-center justify-between w-full mt-10 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel setup
        </button>
        <Button onClick={onNext} disabled={!selected} className="gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
