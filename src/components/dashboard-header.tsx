"use client";

import {
  Search,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";

export function DashboardHeader() {
  function openSearch() {
    // Dispatch Ctrl+K to trigger the search overlay
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
    );
  }

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-surface-border bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <div className="h-6 w-px bg-surface-border mx-2" />
        <button
          onClick={openSearch}
          className="relative w-96 max-w-lg group text-left"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="block w-full pl-10 pr-3 py-2 rounded-lg bg-surface-border/30 text-sm text-text-muted hover:bg-surface-border/50 hover:text-white transition-all cursor-pointer">
            Search clients, transactions, or reports...
          </div>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-text-muted border border-surface-border px-1.5 py-0.5 rounded bg-surface">
              Ctrl+K
            </span>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-orange rounded-full border-2 border-background" />
        </button>
        <button className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-border/50 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
