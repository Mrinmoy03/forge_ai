"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, PricingTable } from "@clerk/nextjs";
import { ArrowRight, Zap, ChevronRight, Check, Globe } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { Badge } from "@/components/ui/badge";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import {
  BlueTitle,
  GrayTitle,
  SectionHeading,
  SectionLabel,
} from "@/components/reusables";

export default function LandingPage() {
  const { isSignedIn, has } = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    if (isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section 
        data-aos="fade-down"
        className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center"
      >
        <HoleBackground
          strokeColor="rgba(255,255,255,0.05)" // blur
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />

        <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Powered by Agentic AI
        </Badge>

        <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl z-10">
          <GrayTitle>Forge your dream</GrayTitle>
          <br />
          <BlueTitle>from a single prompt.</BlueTitle>
        </h1>

        <p 
          data-aos="fade-up" 
          data-aos-delay="200"
          className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/80 z-10"
        >
          Describe what you want to build. AI writes the code, picks the
          packages, and renders a live preview all inside your browser.
        </p>

        <div 
          data-aos="fade-up" 
          data-aos-delay="400"
          className="relative mx-auto mt-12 w-full max-w-2xl"
        >
          <div
            className={cn(
              "rounded-2xl border bg-[#111111] duration-200",
              isFocused
                ? "border-white/20 ring-1 ring-white/8"
                : "border-white/8"
            )}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base"
              style={{ minHeight: 56, maxHeight: 200 }}
            />

            <div className="flex items-center justify-between border-t border-white/6 px-4 py-2.5">
              <span className="text-xs text-white/20">
                Press ⏎ to generate · Shift+⏎ for new line
              </span>

              {isSignedIn ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="h-8 rounded-full px-5 font-semibold"
                  variant={prompt.trim() ? "default" : "secondary"}
                >
                  Generate
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="h-8 rounded-full bg-white px-5 font-semibold">
                    Generate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/80 hover:border-white/15 hover:bg-white/8 hover:text-white/70"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-sm text-white/60" data-aos="fade-up" data-aos-delay="600">
          No credit card required · 10 free generations on sign up
        </p>
      </section>

      {/* BROWSER MOCKUP */}
      <section className="px-4 pb-32" data-aos="zoom-in" data-aos-delay="800">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f0f] shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
            <div className="flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-3 rounded-full bg-white/10" />
              ))}
            </div>

            <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white/5 px-3">
              <span className="text-xs text-white/25">forge.app/workspace</span>
            </div>
          </div>

          <div className="flex h-105">
            {/* Chat panel */}
            <div className="flex w-80 flex-col border-r border-white/6 bg-[#0d0d0d]">
              <div className="border-b border-white/6 px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-white/30">
                  Chat
                </p>
              </div>

              <div className="flex-1 space-y-4 px-4 py-4">
                <div className="flex justify-end">
                  <div className="max-w-55 rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2.5">
                    <p className="text-xs text-white/80">
                      Build a kanban board with 3 columns and drag-and-drop
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white">
                    <Zap className="h-3 w-3 fill-black text-black" />
                  </div>

                  <div className="rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs text-white/60">
                      I&apos;ll build a Kanban board with Todo, In Progress, and
                      Done columns. I&apos;ll use{" "}
                      <code className="text-blue-400/80">@dnd-kit/core</code>{" "}
                      for smooth drag-and-drop…
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white">
                    <Zap className="h-3 w-3 fill-black text-black" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-3">
                    {[0, 0.15, 0.3].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/6 px-3 py-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <span className="flex-1 text-xs text-white/20">
                    Ask AI to modify…
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/20" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-1 border-b border-white/6 px-4">
                <button className="border-b-2 border-blue-400 px-3 py-2.5 text-xs text-white">
                  Preview
                </button>
                <button className="px-3 py-2.5 text-xs text-white/30">
                  Code
                </button>
              </div>

              <div className="flex flex-1 gap-3 overflow-hidden bg-[#141414] p-5">
                {["Todo", "In Progress", "Done"].map((col, ci) => (
                  <div key={col} className="flex w-1/3 flex-col gap-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/40">
                        {col}
                      </span>

                      <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-xs text-white/30">
                        {[3, 2, 1][ci]}
                      </span>
                    </div>

                    {Array.from({ length: [3, 2, 1][ci] }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-white/8 bg-[#1a1a1a] p-2.5"
                      >
                        <div
                          className="mb-1.5 h-2 rounded-full bg-white/15"
                          style={{ width: `${60 + i * 15}%` }}
                        />
                        <div className="h-1.5 w-3/4 rounded-full bg-white/8" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="px-4 pb-32" data-aos="fade-up">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <SectionHeading gray="From prompt" blue="to production." />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }, index) => (
            <div
              key={label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8">
                <Icon className="h-5 w-5 text-white/60 group-hover:text-blue-400/70" />
              </div>
              <p className="mb-2 text-base font-semibold">{label}</p>
              <p className="text-base leading-relaxed text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 pb-32" data-aos="fade-up">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading gray="Four steps" blue="to a working app." />
        </div>

        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <div key={step.number} data-aos="fade-right" data-aos-delay={i * 150} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <span className="font-mono text-sm font-semibold text-white/50">
                    {step.number}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/6" />
                )}
              </div>

              <div className="pb-10 pt-2">
                <p className="mb-2 text-base font-semibold sm:text-lg">
                  {step.label}
                </p>

                <p className="text-base leading-relaxed text-white/50">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-4 pb-32" data-aos="fade-up">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Simple pricing</SectionLabel>
          <SectionHeading gray="Start free," blue="scale when ready." />

          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <PricingTable
            appearance={{
              elements: {
                pricingTableRoot: "!bg-transparent !p-0 !w-full",
                pricingTableCardContainer:
                  "!grid !grid-cols-1 sm:!grid-cols-3 !gap-4 !w-full",
                pricingTableCard:
                  "!bg-[#0f0f0f] !border !border-white/10 !rounded-2xl !text-white !shadow-none",
                pricingTableCardTitle: "!text-white !font-semibold",
                pricingTableCardDescription: "!text-white/40 !text-xs",
                pricingTableCardPrice: "!text-white",
                pricingTableCardFeatureListItem: "!text-white/55 !text-xs",
                pricingTableCardSubscribeButton:
                  "!rounded-full !font-semibold !text-sm",
                pricingTableCardActionButton:
                  "!rounded-full !font-semibold !text-sm",
                pricingTableCardFrequency: "!text-white/30",
                pricingTableCardFeatureListItemCheckmark: "!text-blue-400",
                pricingTableCardHighlightBadge:
                  "!bg-blue-500/10 !text-blue-400 !border-blue-500/20 !rounded-full",
              },
            }}
          />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section data-aos="zoom-in" className="relative mx-auto mb-32 max-w-5xl overflow-hidden rounded-2xl border border-white/8 px-10 py-24 text-center">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.05)" // blur
          numberOfLines={36}
          numberOfDiscs={36}
          particleRGBColor={[147, 197, 253]}
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        <SectionHeading gray="Start building," blue="for free." />

        <p className="mb-8 text-base leading-relaxed text-white/80 sm:text-lg">
          Get 10 free generations on sign up. No credit card required.
          <br />
          Upgrade when you&apos;re ready.
        </p>

        <SignInButton mode="modal">
          <Button
            size="lg"
            className="relative h-11 rounded-full bg-white px-8"
          >
            Get started free
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SignInButton>
      </section>

      <footer className="relative z-10 border-t border-white/7 py-12 px-6 bg-[#050505]">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base text-stone-400">
            Made & Maintained by <span className="text-white/80 font-medium">Mrinmoy</span>
          </p>
          
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://portfolio.com" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors">
              <span className="sr-only">Portfolio</span>
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
