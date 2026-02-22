"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Snippet definitions ─────────────────────────────────────────────────────
const snippets = [
  {
    raw: "const result = await lejja.categorize(tx);",
    terminal: [
      { text: "[SYSTEM]: Analyzing 450 transactions...", color: "text-slate-400" },
      { text: "[DONE]: 98% accuracy achieved.", color: "text-[#06f906]" },
    ],
  },
  {
    raw: "if (result.confidence > 0.85) { ... }",
    terminal: [
      { text: "[SYSTEM]: Confidence check: 0.92 > 0.85 ✓", color: "text-slate-400" },
      { text: "[DONE]: Auto-commit enabled.", color: "text-[#06f906]" },
    ],
  },
  {
    raw: "console.log('Accounting automated.');",
    terminal: [
      { text: "[SYSTEM]: Pipeline complete.", color: "text-slate-400" },
      { text: "[DONE]: Accounting automated successfully.", color: "text-[#06f906]" },
    ],
  },
];

// ── Syntax highlighter ──────────────────────────────────────────────────────
function highlightCode(text: string) {
  const keywords = ["const", "await", "if", "console"];
  const parts: { text: string; color: string }[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Check for string literals
    const strMatch = remaining.match(/^'[^']*'/);
    if (strMatch) {
      parts.push({ text: strMatch[0], color: "text-green-400" });
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // Check for numbers
    const numMatch = remaining.match(/^[\d.]+/);
    if (numMatch && (parts.length === 0 || /[>\s(]$/.test(parts[parts.length - 1].text))) {
      parts.push({ text: numMatch[0], color: "text-orange-400" });
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // Check for keywords
    let foundKeyword = false;
    for (const kw of keywords) {
      if (remaining.startsWith(kw) && (remaining.length === kw.length || /[^a-zA-Z]/.test(remaining[kw.length]))) {
        parts.push({ text: kw, color: "text-purple-400" });
        remaining = remaining.slice(kw.length);
        foundKeyword = true;
        break;
      }
    }
    if (foundKeyword) continue;

    // Check for method calls (word followed by ()
    const methodMatch = remaining.match(/^(\w+)(?=\()/);
    if (methodMatch) {
      parts.push({ text: methodMatch[0], color: "text-yellow-400" });
      remaining = remaining.slice(methodMatch[0].length);
      continue;
    }

    // Check for property access after dot
    const propMatch = remaining.match(/^\.(\w+)/);
    if (propMatch) {
      parts.push({ text: ".", color: "text-slate-300" });
      parts.push({ text: propMatch[1], color: "text-[#06f906]" });
      remaining = remaining.slice(propMatch[0].length);
      continue;
    }

    // Check for identifiers
    const identMatch = remaining.match(/^\w+/);
    if (identMatch) {
      parts.push({ text: identMatch[0], color: "text-emerald-400" });
      remaining = remaining.slice(identMatch[0].length);
      continue;
    }

    // Operators and punctuation
    parts.push({ text: remaining[0], color: "text-slate-300" });
    remaining = remaining.slice(1);
  }

  return parts;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Component ───────────────────────────────────────────────────────────────
export function CodeEditorWindow() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "terminal" | "erasing">("typing");
  const [terminalLines, setTerminalLines] = useState<{ text: string; color: string }[]>([]);

  const currentSnippet = snippets[snippetIndex];
  const displayedText = currentSnippet.raw.slice(0, displayedChars);
  const highlighted = highlightCode(displayedText);

  // ── Typing phase ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "typing") return;

    if (displayedChars < currentSnippet.raw.length) {
      const timer = setTimeout(() => {
        setDisplayedChars((c) => c + 1);
      }, 45);
      return () => clearTimeout(timer);
    }

    // Typing complete → show terminal output
    setPhase("terminal");
  }, [phase, displayedChars, currentSnippet.raw.length]);

  // ── Terminal output phase ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "terminal") return;

    let cancelled = false;
    const lines = currentSnippet.terminal;

    // Reset terminal for this cycle
    setTerminalLines([]);

    const runSequence = async () => {
      // Small initial delay
      await delay(400);
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        setTerminalLines((prev) => [...prev, lines[i]]);
        await delay(600);
      }
      if (cancelled) return;
      // Wait then move to erasing
      await delay(2000);
      if (cancelled) return;
      setPhase("erasing");
    };

    runSequence();
    return () => { cancelled = true; };
  }, [phase, currentSnippet.terminal]);

  // ── Erasing phase ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "erasing") return;

    if (displayedChars > 0) {
      const timer = setTimeout(() => {
        setDisplayedChars((c) => c - 1);
      }, 25);
      return () => clearTimeout(timer);
    }

    // Erasing complete → move to next snippet
    setTerminalLines([]);
    setSnippetIndex((i) => (i + 1) % snippets.length);
    setPhase("typing");
  }, [phase, displayedChars]);

  return (
    <div className="mt-20 w-full max-w-3xl">
      {/* ── Editor Window ──────────────────────────────────────────────── */}
      <div className="rounded-xl bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-[#06f906]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Title bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#151515] gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <div className="ml-4 text-xs text-slate-500 font-mono">
            lejja_pipeline.ts
          </div>
        </div>

        {/* Code area */}
        <div className="p-6 font-mono text-sm min-h-[60px]">
          <span className="text-slate-500 select-none mr-4">1</span>
          {highlighted.map((part, i) => (
            <span key={`${i}-${part.text}`} className={part.color}>
              {part.text}
            </span>
          ))}
          <motion.span
            className="inline-block w-[2px] h-[18px] bg-[#06f906] ml-[1px] align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        {/* ── Terminal ──────────────────────────────────────────────────── */}
        <div className="border-t border-white/5 bg-[#0f0f0f]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#06f906] animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Terminal
            </span>
          </div>
          <div className="p-4 font-mono text-xs min-h-[56px] space-y-1">
            <AnimatePresence mode="popLayout">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={`${snippetIndex}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={line.color}
                >
                  {line.text}
                </motion.div>
              ))}
              {terminalLines.length === 0 && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-600"
                >
                  <span className="animate-pulse">█</span> Awaiting input...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
