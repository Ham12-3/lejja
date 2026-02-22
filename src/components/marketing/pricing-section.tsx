"use client";

import { useState } from "react";
import { CheckCircle, Zap, Rocket, Shield } from "lucide-react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4 bg-[#121212] relative">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06f906]/10 border border-[#06f906]/20 text-[#06f906] text-xs font-mono mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06f906] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06f906]" />
            </span>
            LIVE API STATUS: OPERATIONAL
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Scalable{" "}
            <span className="text-[#06f906]">Intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-lg mx-auto">
            Choose the compute power that fits your transaction volume.
            Transparent pricing for teams of all sizes.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium transition-colors ${!isAnnual ? "text-white" : "text-slate-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                isAnnual ? "bg-[#06f906]" : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full shadow-md transition-transform duration-200 ${
                  isAnnual
                    ? "translate-x-6 bg-[#121212]"
                    : "translate-x-0 bg-white"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${isAnnual ? "text-white" : "text-slate-500"}`}
            >
              Annual{" "}
              <span className="text-[#06f906] text-xs ml-1 font-mono">
                -20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative">
          {/* Starter */}
          <div className="group relative flex flex-col rounded-xl border border-white/5 bg-[#1e1e1e] p-8 hover:border-[#06f906]/30 transition-all duration-300 hover:shadow-[0_0_10px_rgba(6,249,6,0.1),0_0_20px_rgba(6,249,6,0.05)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-400 text-sm">
                Essential tools for individual developers.
              </p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">£0</span>
                <span className="text-slate-500 font-mono text-sm">/mo</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              {[
                "Core AI Bookkeeping",
                "1 User Seat",
                "Basic Reporting",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle className="w-5 h-5 text-[#06f906] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="border-t border-white/5 my-4 pt-4">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                  Tech Specs
                </p>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400 mb-2">
                  <span>API Rate Limit</span>
                  <span className="text-white">10 RPM</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400">
                  <span>Data Retention</span>
                  <span className="text-white">7 Days</span>
                </div>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm">
              Start Building
            </button>
          </div>

          {/* Professional (Highlighted) */}
          <div className="group relative flex flex-col rounded-xl border border-[#06f906]/40 bg-[#1e1e1e] p-8 shadow-[0_0_15px_rgba(6,249,6,0.2),0_0_30px_rgba(6,249,6,0.1)] z-10 scale-[1.02] lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#06f906] text-[#121212] text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,249,6,0.4)] tracking-wide uppercase">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Professional
                <Zap className="w-4 h-4 text-[#06f906]" />
              </h3>
              <p className="text-slate-400 text-sm">
                Full power for growing teams.
              </p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-[#06f906] transition-all duration-300">
                  {isAnnual ? "£39" : "£49"}
                </span>
                <span className="text-slate-500 font-mono text-sm">/mo</span>
              </div>
              {isAnnual && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-slate-500 line-through text-sm font-mono">
                    £49/mo
                  </span>
                  <span className="text-[#06f906] text-xs font-mono font-bold">
                    Save £120/yr
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4 mb-8">
              {[
                "Full GenAI Suite",
                "Natural Language Querying",
                "5 User Seats",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <CheckCircle className="w-5 h-5 text-[#06f906] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="border-t border-white/10 my-4 pt-4">
                <p className="text-xs font-mono text-[#06f906]/70 uppercase tracking-wider mb-3">
                  Tech Specs
                </p>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400 mb-2">
                  <span>API Rate Limit</span>
                  <span className="text-[#06f906] font-bold">500 RPM</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400 mb-2">
                  <span>Context Window</span>
                  <span className="text-white">1M Tokens</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400">
                  <span>Priority</span>
                  <span className="text-white">P1 Queue</span>
                </div>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-lg bg-[#06f906] hover:bg-[#05c905] text-[#121212] font-bold transition-all shadow-[0_0_15px_rgba(6,249,6,0.3)] hover:shadow-[0_0_20px_rgba(6,249,6,0.5)] text-sm flex items-center justify-center gap-2">
              <span>Deploy Professional</span>
              <Rocket className="w-4 h-4" />
            </button>
          </div>

          {/* Enterprise */}
          <div className="group relative flex flex-col rounded-xl border border-white/5 bg-[#1e1e1e] p-8 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(11,218,108,0.15)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Enterprise
              </h3>
              <p className="text-slate-400 text-sm">
                Custom solutions for large scale.
              </p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              {[
                "Custom LLM Training",
                "SSO Integration (SAML)",
                "Dedicated Support Engineer",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="border-t border-white/5 my-4 pt-4">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                  Tech Specs
                </p>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400 mb-2">
                  <span>API Access</span>
                  <span className="text-emerald-400 font-bold">Unlimited</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400 mb-2">
                  <span>Deployment</span>
                  <span className="text-white">Private VPC</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono text-slate-400">
                  <span>SLA</span>
                  <span className="text-white">99.99% Uptime</span>
                </div>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-[0_0_10px_rgba(11,218,108,0.3)] hover:shadow-[0_0_15px_rgba(11,218,108,0.5)] text-sm">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
