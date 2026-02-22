"use client";

import { CheckCircle, Loader2, Circle } from "lucide-react";

export interface LogEntry {
  label: string;
  status: "completed" | "active" | "pending";
}

interface ActivityLogProps {
  entries: LogEntry[];
}

export function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <div className="w-full max-w-sm space-y-3">
      {entries.map((entry) => (
        <div key={entry.label} className="flex items-center gap-3 text-sm">
          {entry.status === "completed" && (
            <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
          )}
          {entry.status === "active" && (
            <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
          )}
          {entry.status === "pending" && (
            <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
          )}
          <span
            className={
              entry.status === "completed"
                ? "text-foreground"
                : entry.status === "active"
                  ? "text-foreground"
                  : "text-muted-foreground/50"
            }
          >
            {entry.label}
          </span>
        </div>
      ))}
    </div>
  );
}
