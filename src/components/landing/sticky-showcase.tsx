"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Plane,
} from "lucide-react";

export function StickyFeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Card 1: fully visible at 0–0.28, crossfades out by 0.33
  const card1Opacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.33],
    [1, 1, 0]
  );
  const card1Scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.33],
    [1, 1, 0.9]
  );

  // Card 2: fades in at 0.28–0.33, visible 0.33–0.61, fades out by 0.66
  const card2Opacity = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.61, 0.66],
    [0, 1, 1, 0]
  );
  const card2Scale = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.61, 0.66],
    [0.8, 1, 1, 0.9]
  );

  // Card 3: fades in at 0.61–0.66, stays visible through 1.0
  const card3Opacity = useTransform(
    scrollYProgress,
    [0.61, 0.66, 1],
    [0, 1, 1]
  );
  const card3Scale = useTransform(
    scrollYProgress,
    [0.61, 0.66, 1],
    [0.8, 1, 1]
  );

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative min-h-[300vh] bg-[#121212] text-white"
    >
      {/* Sticky viewport-height container — pins both columns */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* ── Left Column: Pinned Text ────────────────────────────── */}
            <div className="lg:w-1/2 flex flex-col gap-6 justify-center">
              <div className="inline-flex items-center gap-2 text-[#06f906] font-medium tracking-wider uppercase text-sm">
                <span className="h-px w-8 bg-[#06f906]" />
                <span>Future of Finance</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                GenAI will execute more{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06f906] to-emerald-400">
                  mundane
                </span>{" "}
                accounting tasks.
              </h2>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                Stop wasting hours on data entry. Our AI agents handle the
                repetitive work so you can focus on strategic financial planning.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button className="group flex items-center gap-2 text-white font-bold border-b border-[#06f906] pb-1 hover:text-[#06f906] transition-all">
                  See how it works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* ── Right Column: Scroll-Driven Cards ───────────────────── */}
            <div className="lg:w-1/2 flex items-center">
              {/* Grid stacks all 3 cards in the same cell */}
              <div className="w-full grid grid-cols-1 grid-rows-1">
                {/* Card 1: Automated Reconciliation */}
                <motion.div
                  style={{ opacity: card1Opacity, scale: card1Scale }}
                  className="col-start-1 row-start-1 will-change-transform"
                >
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-[#06f906]/50 transition-colors shadow-2xl">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#06f906]/10 blur-3xl group-hover:bg-[#06f906]/20 transition-all" />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#06f906]/20 to-transparent border border-[#06f906]/20 text-[#06f906]">
                        <RefreshCw className="w-7 h-7" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                          Automated Reconciliation
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          AI matches transactions across thousands of entries
                          instantly, detecting anomalies that human eyes often
                          miss.
                        </p>
                      </div>
                      {/* Code terminal */}
                      <div className="mt-4 overflow-hidden rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/5">
                          <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            LEJJA_CORE_V2.0
                          </div>
                        </div>
                        <div className="p-4 font-mono text-xs text-slate-300 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-emerald-400">
                              &gt;&gt;&gt; scan_invoices()
                            </span>
                            <span className="text-slate-600">32ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Matching Ref:{" "}
                              <span className="text-emerald-400">
                                #INV-2024-001
                              </span>
                            </span>
                            <span className="text-[#06f906]">MATCHED</span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Matching Ref:{" "}
                              <span className="text-emerald-400">
                                #INV-2024-002
                              </span>
                            </span>
                            <span className="text-[#06f906]">MATCHED</span>
                          </div>
                          <div className="h-1 w-full mt-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#06f906] w-full animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Real-time Tax Prediction */}
                <motion.div
                  style={{ opacity: card2Opacity, scale: card2Scale }}
                  className="col-start-1 row-start-1 will-change-transform"
                >
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-[#06f906]/50 transition-colors shadow-2xl">
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 text-emerald-400">
                        <TrendingUp className="w-7 h-7" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                          Real-time Tax Prediction
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          Forecast liabilities as they happen, not at the end of
                          the quarter. Make informed decisions with live tax
                          impact analysis.
                        </p>
                      </div>
                      {/* Bar chart */}
                      <div className="mt-4 relative h-32 rounded-lg bg-black/40 border border-white/5 overflow-hidden flex items-end justify-between px-2 pb-0 pt-8 gap-1">
                        <div className="w-full bg-slate-800/50 rounded-t h-[40%]" />
                        <div className="w-full bg-slate-800/50 rounded-t h-[65%]" />
                        <div className="w-full bg-slate-800/50 rounded-t h-[50%]" />
                        <div className="w-full bg-slate-800/50 rounded-t h-[80%]" />
                        <div className="w-full bg-slate-800/50 rounded-t h-[60%]" />
                        <div className="w-full bg-gradient-to-t from-[#06f906]/80 to-[#06f906]/20 rounded-t h-[90%] relative group-hover:scale-y-105 transition-transform origin-bottom">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-[#06f906] bg-black/80 px-2 py-1 rounded border border-[#06f906]/30">
                            +12%
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Smart Ledger Entry */}
                <motion.div
                  style={{ opacity: card3Opacity, scale: card3Scale }}
                  className="col-start-1 row-start-1 will-change-transform"
                >
                  <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-[#06f906]/50 transition-colors shadow-2xl">
                    <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all" />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20 text-purple-400">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">
                          Smart Ledger Entry
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          Categorizes expenses with 99.9% accuracy based on
                          historical patterns, reducing manual coding errors to
                          near zero.
                        </p>
                      </div>
                      {/* Category visualization */}
                      <div className="mt-4 flex gap-3 overflow-hidden">
                        <div className="flex-1 rounded-lg bg-black/40 border border-white/5 p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-orange-500/20 flex items-center justify-center text-orange-400">
                              <Plane className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col">
                              <div className="h-2 w-16 bg-slate-700 rounded mb-1" />
                              <div className="h-1.5 w-10 bg-slate-800 rounded" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-50">
                            <div className="h-6 w-6 rounded bg-slate-800" />
                            <div className="flex flex-col">
                              <div className="h-2 w-12 bg-slate-800 rounded mb-1" />
                              <div className="h-1.5 w-8 bg-slate-900 rounded" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-center text-slate-600">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                        <div className="flex-1 rounded-lg bg-[#06f906]/10 border border-[#06f906]/20 p-3 flex flex-col items-center justify-center text-center">
                          <div className="text-[#06f906] text-xs font-bold mb-1">
                            Travel
                          </div>
                          <div className="text-[10px] text-[#06f906]/60">
                            Category
                          </div>
                          <div className="mt-2 h-1 w-full bg-[#06f906]/20 rounded-full">
                            <div className="h-full w-[99%] bg-[#06f906] rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-1/3 h-1/3 bg-[#06f906]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-1/4 h-1/3 bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
