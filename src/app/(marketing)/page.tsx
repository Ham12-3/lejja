import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code,
  Rocket,
  Zap,
  Lock,
  RefreshCw,
  Building2,
  User,
  CheckCircle,
  Hexagon,
  Triangle,
  Infinity,
  Bot,
  UserRound,
  Diamond,
} from "lucide-react";
import { StickyFeatureShowcase } from "@/components/landing/sticky-showcase";
import { CodeEditorWindow } from "@/components/marketing/code-editor-window";
import { PricingSection } from "@/components/marketing/pricing-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 overflow-x-clip">
      {/* ═══════════════════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="w-full border-b border-white/10 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-[#06f906] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">
              Lejja
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-slate-400 hover:text-[#06f906] transition-colors text-sm font-medium"
              href="#features"
            >
              Product
            </a>
            <a
              className="text-slate-400 hover:text-[#06f906] transition-colors text-sm font-medium"
              href="#showcase"
            >
              Docs
            </a>
            <a
              className="text-slate-400 hover:text-[#06f906] transition-colors text-sm font-medium"
              href="#pricing"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <Link
              className="hidden sm:block text-slate-300 hover:text-white text-sm font-medium transition-colors"
              href="/dashboard"
            >
              Sign In
            </Link>
            <button className="bg-[#06f906] text-[#121212] hover:bg-[#34fb34] hover:shadow-[0_0_15px_rgba(6,249,6,0.7),0_0_30px_rgba(6,249,6,0.4)] shadow-[0_0_10px_rgba(6,249,6,0.5),0_0_20px_rgba(6,249,6,0.3)] transition-all duration-300 px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-32 px-4 overflow-hidden min-h-[85vh]">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, rgba(6,249,6,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,249,6,0.05) 1px, transparent 1px)",
          }}
        />
        {/* Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121212] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#06f906]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06f906] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06f906]" />
            </span>
            <span className="text-xs font-medium text-[#06f906] tracking-wide uppercase">
              v2.0 Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
            The future of <br /> accounting is
            <span className="block mt-2 md:inline md:mt-0">
              <span className="inline-flex items-center justify-center align-middle mx-2 text-[#06f906]">
                <UserRound className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
              </span>
              human
              <span className="text-slate-600 mx-2">+</span>
              <span className="inline-flex items-center justify-center align-middle mx-2 text-[#06f906]">
                <Bot className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
              </span>
              AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mt-4">
            Stop drowning in spreadsheets. Lejja provides the{" "}
            <span className="text-slate-200 font-medium">
              API-first infrastructure
            </span>{" "}
            for modern finance teams to automate reconciliation and maintain
            control.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <button className="group relative bg-[#06f906] text-[#121212] text-base font-bold px-8 py-4 rounded-lg shadow-[0_0_10px_rgba(6,249,6,0.5),0_0_20px_rgba(6,249,6,0.3)] hover:shadow-[0_0_15px_rgba(6,249,6,0.7),0_0_30px_rgba(6,249,6,0.4)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10">Join The Community</span>
              <Rocket className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button className="group px-8 py-4 rounded-lg border border-white/20 text-white hover:bg-white/5 hover:border-[#06f906]/50 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
              <Code className="w-5 h-5 text-slate-400 group-hover:text-[#06f906] transition-colors" />
              <span>Read Documentation</span>
            </button>
          </div>

          {/* Live Code Editor */}
          <CodeEditorWindow />

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-white/5 w-full">
            <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-semibold">
              Trusted by engineering teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <Hexagon className="w-5 h-5" /> ACME Corp
              </span>
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <Triangle className="w-5 h-5" /> Vertex
              </span>
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <Infinity className="w-5 h-5" /> Loop Infinite
              </span>
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5" /> FlashTrade
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: DEVELOPER-FIRST FEATURES + CHOOSE YOUR PATH
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 px-4 bg-[#121212] relative">
        <div className="max-w-7xl mx-auto">
          {/* Developer-First Features */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Developer-First Finance
              </h2>
              <p className="text-slate-400 max-w-lg">
                Built for engineering teams who need control, automation, and
                immutable logs.
              </p>
            </div>
            <a
              className="text-[#06f906] hover:text-white font-medium flex items-center gap-2 transition-colors group"
              href="#"
            >
              View API Documentation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            <div className="group p-8 rounded-xl border border-white/10 bg-[#181818] hover:border-[#06f906]/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#06f906]/10 flex items-center justify-center text-[#06f906] mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">API Driven</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Full programmatic access to your financial data. Build custom
                flows with our typed SDKs.
              </p>
            </div>
            <div className="group p-8 rounded-xl border border-white/10 bg-[#181818] hover:border-[#06f906]/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#06f906]/10 flex items-center justify-center text-[#06f906] mb-6 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Real-time Sync
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Webhooks and events for instant reconciliation across Stripe,
                Plaid, and bank feeds.
              </p>
            </div>
            <div className="group p-8 rounded-xl border border-white/10 bg-[#181818] hover:border-[#06f906]/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#06f906]/10 flex items-center justify-center text-[#06f906] mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Immutable Ledger
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Audit-proof logging for every transaction. Double-entry
                accounting logic baked in.
              </p>
            </div>
          </div>

          {/* Choose Your Path */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-slate-400">
              Tailored AI workflows designed for every scale of accounting
              complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card: Accounting Firms */}
            <div className="group relative flex flex-col h-full bg-[#1e1e1e] rounded-xl border border-slate-800 p-8 md:p-10 hover:border-[#06f906]/50 transition-all duration-300 shadow-xl overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#06f906]/10 rounded-full blur-[80px] group-hover:bg-[#06f906]/20 transition-all duration-500" />
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 bg-[#06f906]/10 rounded-lg">
                  <Building2 className="w-7 h-7 text-[#06f906]" />
                </div>
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-[#06f906] bg-[#06f906]/10 rounded-full border border-[#06f906]/20">
                  Enterprise
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3">
                  For Accounting Firms
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Scale operations and automate compliance for your entire
                  roster. Manage multiple teams, enforce firm-wide AI policies,
                  and integrate with enterprise ERPs seamlessly.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Multi-tenant architecture",
                    "Team collaboration tools",
                    "Advanced audit trails",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle className="w-5 h-5 text-[#06f906] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-800">
                <Link href="/onboard" className="w-full group/btn flex items-center justify-center gap-2 bg-[#06f906] hover:bg-[#05c905] text-[#121212] font-bold py-3 px-6 rounded-lg transition-all duration-200">
                  <span>Enterprise Access</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card: Independent CPAs */}
            <div className="group relative flex flex-col h-full bg-[#1e1e1e] rounded-xl border border-slate-800 p-8 md:p-10 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <User className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  Professional
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3">
                  For Independent CPAs
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Supercharge your productivity and reclaim your time. The
                  perfect AI assistant for solo practitioners handling tax
                  preparation, bookkeeping, and advisory.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Instant document processing",
                    "Client portal included",
                    "Automated categorization",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-800">
                <Link href="/onboard" className="w-full group/btn flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
                  <span>Start Solo</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Free 14-day trial, no credit card
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: STICKY FEATURE SHOWCASE (Framer Motion useScroll)
          - 300vh parent as scroll runway
          - Left column: pinned heading (sticky top-0 h-screen)
          - Right column: cards crossfade via scroll progress thresholds
          CRITICAL: No overflow-hidden on any ancestor — breaks sticky
      ═══════════════════════════════════════════════════════════════════ */}
      <StickyFeatureShowcase />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: PRICING (Client component with working toggle + GBP)
      ═══════════════════════════════════════════════════════════════════ */}
      <PricingSection />

      {/* Trust Logos */}
      <section className="pb-20 px-4 bg-[#121212]">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-xs font-mono text-slate-600 mb-6 uppercase tracking-widest">
            Powering finance stacks at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Diamond className="w-5 h-5" />
              <span className="font-bold text-lg">Acme Corp</span>
            </div>
            <div className="flex items-center gap-2">
              <Triangle className="w-5 h-5" />
              <span className="font-bold text-lg">Triangle Inc</span>
            </div>
            <div className="flex items-center gap-2">
              <Hexagon className="w-5 h-5" />
              <span className="font-bold text-lg">HexaSystems</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <span className="font-bold text-lg">CodeFlow</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/10 bg-[#0f0f0f] py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <BookOpen className="w-5 h-5 text-[#06f906]" />
              <h3 className="font-bold text-lg">Lejja</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered accounting infrastructure for the modern internet
              economy.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#pricing"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Legal
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[#06f906] transition-colors"
                  href="#"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            &copy; 2024 Lejja AI Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500">
            <a className="hover:text-[#06f906] transition-colors" href="#">
              Twitter
            </a>
            <a className="hover:text-[#06f906] transition-colors" href="#">
              GitHub
            </a>
            <a className="hover:text-[#06f906] transition-colors" href="#">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
