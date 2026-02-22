"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagInput } from "./tag-input";
import { configureSchema, type ConfigureFormData } from "@/lib/schemas/onboard";

interface StepConfigureProps {
  data: ConfigureFormData;
  onChange: (data: ConfigureFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepConfigure({
  data,
  onChange,
  onNext,
  onBack,
}: StepConfigureProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit() {
    const result = configureSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext();
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Configure Your Book
      </h2>
      <p className="text-muted-foreground text-sm mb-8 text-center">
        Set up your client details and sync preferences.
      </p>

      <div className="space-y-5">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Client Legal Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={data.clientName}
            onChange={(e) => onChange({ ...data, clientName: e.target.value })}
            placeholder="Acme Corporation Ltd."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
          />
          {errors.clientName && (
            <p className="text-destructive text-xs mt-1">{errors.clientName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="finance@acme.com"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Industry Verticals */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Industry Verticals
          </label>
          <TagInput
            tags={data.verticals}
            onChange={(verticals) => onChange({ ...data, verticals })}
            placeholder="e.g. SaaS, Fintech, Retail — press Enter"
          />
        </div>

        {/* Sync Preferences */}
        <div className="pt-2 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Sync Preferences
          </h3>

          {/* AI Categorization */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">AI Categorization</p>
              <p className="text-xs text-muted-foreground">
                Auto-classify transactions using AI
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.aiCategorization}
              onClick={() =>
                onChange({ ...data, aiCategorization: !data.aiCategorization })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                data.aiCategorization ? "bg-primary" : "bg-surface-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  data.aiCategorization ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Anomaly Scanning */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Anomaly Scanning</p>
              <p className="text-xs text-muted-foreground">
                Flag unusual transaction patterns
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.anomalyScanning}
              onClick={() =>
                onChange({ ...data, anomalyScanning: !data.anomalyScanning })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                data.anomalyScanning ? "bg-primary" : "bg-surface-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  data.anomalyScanning ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between w-full mt-10 pt-6 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="gap-2">
          Start Initial Sync
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
