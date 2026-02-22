"use client";

import { BookOpen, HelpCircle, UserCircle } from "lucide-react";

interface OnboardHeaderProps {
  stepTitle: string;
}

export function OnboardHeader({ stepTitle }: OnboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">
          Lejja
        </span>
        <span className="text-muted-foreground mx-2">/</span>
        <span className="text-sm text-muted-foreground">{stepTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center">
          <UserCircle className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
