"use client"
import { useState, useCallback, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function LearnPage() {
  const tracks = [
    {
      slug: "banking",
      name: "Banking",
      desc: "Master accounts, payments, credit, and digital banking fundamentals.",
      href: "/banking",
      accent: "hover:ring-blue-400/50 hover:shadow-[0_0_0_2px_rgba(96,165,250,0.35)]",
    },
    {
      slug: "investment",
      name: "Investment",
      desc: "Learn stocks, ETFs, bonds, risk, and portfolio-building basics.",
      href: "/investment",
      accent: "hover:ring-pink-400/50 hover:shadow-[0_0_0_2px_rgba(244,114,182,0.35)]",
    },
    {
      slug: "insurance",
      name: "Insurance",
      desc: "Understand life, health, property insurance and how policies work.",
      href: "/insurance",
      accent: "hover:ring-green-400/50 hover:shadow-[0_0_0_2px_rgba(74,222,128,0.35)]",
    },
    {
      slug: "taxation",
      name: "Taxation",
      desc: "Basics of filing, deductions, and planning with confidence.",
      href: "/taxation",
      accent: "hover:ring-white/40 hover:shadow-[0_0_0_2px_rgba(255,255,255,0.25)]",
    },
  ]

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pendingTrackHref, setPendingTrackHref] = useState<string | null>(null)
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("learning-level") : null
    if (saved === "beginner" || saved === "intermediate" || saved === "advanced") {
      setLevel(saved)
    }
  }, [])

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setPendingTrackHref(href)
    setOpen(true)
  }, [])

  const confirmLevel = useCallback(() => {
    if (!pendingTrackHref) return
    try {
      window.localStorage.setItem("learning-level", level)
    } catch {}
    router.push(`${pendingTrackHref}?level=${level}`)
    setOpen(false)
  }, [pendingTrackHref, level, router])

  return (
    <main className="min-h-dvh bg-background text-foreground px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Learning Hub</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Choose a track to start learning. Each module includes short reads, PDFs, and curated videos. Earn XP and
              badges as you complete lessons and quick quizzes.
            </p>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tracks.map((t) => (
            <a
              key={t.slug}
              href={t.href}
              onClick={(e) => handleTrackClick(e, t.href)}
              className={[
                "group rounded-xl ring-1 ring-[var(--color-border)] bg-background/40 backdrop-blur-sm",
                "p-5 md:p-6 transition-all duration-200",
                "hover:translate-y-[-2px] hover:bg-background/50",
                "focus:outline-none focus:ring-2 focus:ring-[var(--brand)]",
                t.accent,
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{t.name}</h2>
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-foreground/30 group-hover:bg-foreground/50 transition-colors"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
              <div className="mt-4 text-sm text-[var(--brand)] underline underline-offset-4 opacity-90 group-hover:opacity-100">
                Start learning →
              </div>
            </a>
          ))}
        </section>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select your level</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We’ll tailor the study materials and path based on your experience.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/10">
                <input
                  type="radio"
                  name="learning-level"
                  value="beginner"
                  checked={level === "beginner"}
                  onChange={() => setLevel("beginner")}
                />
                <div>
                  <div className="text-sm font-medium">Beginner</div>
                  <div className="text-xs text-muted-foreground">Foundational concepts and step-by-step guidance</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/10">
                <input
                  type="radio"
                  name="learning-level"
                  value="intermediate"
                  checked={level === "intermediate"}
                  onChange={() => setLevel("intermediate")}
                />
                <div>
                  <div className="text-sm font-medium">Intermediate</div>
                  <div className="text-xs text-muted-foreground">Mix of fundamentals and practical applications</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/10">
                <input
                  type="radio"
                  name="learning-level"
                  value="advanced"
                  checked={level === "advanced"}
                  onChange={() => setLevel("advanced")}
                />
                <div>
                  <div className="text-sm font-medium">Advanced</div>
                  <div className="text-xs text-muted-foreground">Deeper dives, faster pace, and challenge-focused</div>
                </div>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLevel}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
