"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import type { Lesson, Track, UserRating } from "./types"
import { completeLesson, loadProgress } from "./progress-store"
import { XpPill, ProgressBar, RatingBadge } from "./progress"
import { BadgeShelf } from "./badge-shelf"
import { LessonCard } from "./lesson-card"

function extractYouTubeId(link?: string): string | null {
  if (!link) return null
  try {
    const u = new URL(link)
    const host = u.hostname.replace(/^www\./, "")
    const parts = u.pathname.split("/").filter(Boolean)

    // youtu.be/{id}
    if (host === "youtu.be" && parts.length >= 1) {
      return parts[0]
    }

    if (host.endsWith("youtube.com")) {
      // /watch?v={id}
      if (u.pathname.startsWith("/watch")) {
        const v = u.searchParams.get("v")
        return v || null
      }
      // /shorts/{id}
      if (u.pathname.startsWith("/shorts/") && parts.length >= 2) {
        return parts[1]
      }
      // /embed/{id}
      if (u.pathname.startsWith("/embed/") && parts.length >= 2) {
        return parts[1]
      }
    }
  } catch {
    // ignore parse errors
  }
  return null
}

function toNoCookieEmbed(link?: string): string | undefined {
  if (!link) return link
  const id = extractYouTubeId(link)
  if (id) {
    return `https://www.youtube-nocookie.com/embed/${id}`
  }
  // Fallback: try to rewrite host safely if it's a youtube embed URL
  try {
    const u = new URL(link)
    if (u.hostname.includes("youtube")) {
      u.hostname = "www.youtube-nocookie.com"
      if (!u.pathname.startsWith("/embed/")) {
        const v = u.searchParams.get("v")
        if (v) {
          u.pathname = `/embed/${v}`
          u.search = ""
        }
      }
      return u.toString()
    }
  } catch {
    // return original if URL parsing fails
  }
  return link
}

function LessonViewer({
  lesson,
  onComplete,
}: {
  lesson: Lesson
  onComplete: () => void
}) {
  if (!lesson) return null
  return (
    <div className="rounded-lg border border-muted p-4 md:p-6 surface-card">
      <h2 className="text-xl font-medium">{lesson.title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed">
        {lesson.type === "text" ? <p className="text-pretty text-muted-foreground">{lesson.content}</p> : null}

        {lesson.type === "video" && lesson.link ? (
          <div className="aspect-video w-full overflow-hidden rounded-md border border-muted">
            <iframe
              className="h-full w-full"
              src={toNoCookieEmbed(lesson.link)}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          </div>
        ) : null}

        {lesson.type === "pdf" && lesson.link ? (
          <div className="rounded-md border border-muted p-3">
            <p className="text-muted-foreground">This lesson references a PDF document.</p>
            <Link
              href={lesson.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover-glow-white"
            >
              Open PDF in new tab
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <button onClick={onComplete} className="btn-brand-outline hover-glow-green">
          Mark lesson complete
        </button>
      </div>
    </div>
  )
}

export function LearningPage({ track }: { track: Track }) {
  const [progress, setProgress] = useState<{
    completedLessonIds: string[]
    xp: number
    quizScore?: number
    rating?: UserRating
  }>({
    completedLessonIds: [],
    xp: 0,
    quizScore: undefined,
    rating: undefined,
  })
  const [selectedId, setSelectedId] = useState<string>(track.lessons[0]?.id)
  const [ready, setReady] = useState(false)
  const search = useSearchParams()
  const levelParam = (search?.get("level") || "").toLowerCase()
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | undefined>(undefined)

  useEffect(() => {
    let initial: "beginner" | "intermediate" | "advanced" | undefined
    if (levelParam === "beginner" || levelParam === "intermediate" || levelParam === "advanced") {
      initial = levelParam
    } else {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("learning-level") : null
      if (saved === "beginner" || saved === "intermediate" || saved === "advanced") {
        initial = saved
      }
    }
    if (initial) {
      setLevel(initial)
      try {
        window.localStorage.setItem("learning-level", initial)
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelParam])

  useEffect(() => {
    ;(async () => {
      const p = await loadProgress(track.id)
      setProgress(p)
      setReady(true)
    })()
  }, [track.id])

  const visibleLessons = useMemo(() => {
    if (!level) return track.lessons
    return track.lessons.filter((l) => !l.level || l.level === level)
  }, [track.lessons, level])

  useEffect(() => {
    const exists = visibleLessons.some((l) => l.id === selectedId)
    if (!exists && visibleLessons[0]?.id) {
      setSelectedId(visibleLessons[0].id)
    }
  }, [visibleLessons, selectedId])

  const selected = useMemo(
    () => (visibleLessons.find((l) => l.id === selectedId) || visibleLessons[0]) as Lesson,
    [visibleLessons, selectedId],
  )

  const percent = Math.round((progress.completedLessonIds.length / Math.max(1, visibleLessons.length)) * 100)

  async function handleComplete() {
    await completeLesson(track.id, selected.id)
    const p = await loadProgress(track.id)
    setProgress(p)
  }

  const personalized = useMemo(() => {
    const lessons = visibleLessons
    if (!lessons?.length || !level) return null

    const pickFirst = (n: number) => lessons.slice(0, Math.min(n, lessons.length))
    const pickLast = (n: number) => lessons.slice(Math.max(0, lessons.length - n))

    let planTitle = ""
    let recommended: Lesson[] = []

    if (level === "beginner") {
      const texts = lessons.filter((l) => l.type === "text")
      const videos = lessons.filter((l) => l.type === "video")
      recommended = [...texts.slice(0, 2), ...videos.slice(0, 1)]
      if (recommended.length < 3) {
        recommended = pickFirst(3)
      }
      planTitle = "Beginner Path"
    } else if (level === "intermediate") {
      recommended = pickFirst(4)
      planTitle = "Intermediate Path"
    } else {
      recommended = pickLast(3)
      planTitle = "Advanced Path"
    }

    const seen = new Set<string>()
    recommended = recommended.filter((l) => {
      if (seen.has(l.id)) return false
      seen.add(l.id)
      return true
    })

    return { planTitle, recommended }
  }, [visibleLessons, level])

  return (
    <main className="min-h-dvh text-foreground flex items-start justify-center">
      <section className={cn("mx-auto w-full max-w-7xl p-6 md:p-10", "space-y-6")}>
        <header className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-pretty text-3xl md:text-4xl font-semibold">{track.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Learn at your own pace. Earn XP for each lesson.</p>
            {level ? (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <span className="opacity-70">Your level:</span>
                <span className="font-medium capitalize">{level}</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <XpPill xp={progress.xp} />
            <RatingBadge rating={progress.rating} />
          </div>
        </header>

        {personalized ? (
          <div className="rounded-lg border border-muted p-4 md:p-6 surface-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{personalized.planTitle}</h2>
              <button
                className="btn-brand-outline hover-glow-blue text-sm"
                onClick={() => {
                  if (personalized.recommended[0]) setSelectedId(personalized.recommended[0].id)
                }}
              >
                Start this path
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              We curated a short path based on your level. Follow these steps to complete the course efficiently.
            </p>
            <ol className="mt-4 space-y-2">
              {personalized.recommended.map((l, idx) => (
                <li key={l.id} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs">
                    {idx + 1}
                  </span>
                  <button
                    className={cn(
                      "text-left underline-offset-4 hover:underline text-sm",
                      selectedId === l.id ? "font-medium" : "text-muted-foreground",
                    )}
                    onClick={() => setSelectedId(l.id)}
                  >
                    {l.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-muted p-4 surface-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-xs text-muted-foreground">{percent}%</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={percent} />
              </div>
              {progress.rating && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Performance Level</span>
                  <RatingBadge rating={progress.rating} />
                </div>
              )}
              <div className="mt-3">
                <BadgeShelf xp={progress.xp} />
              </div>
            </div>

            <div className="space-y-2">
              {visibleLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  active={selectedId === lesson.id}
                  completed={progress.completedLessonIds.includes(lesson.id)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {ready ? <LessonViewer lesson={selected} onComplete={handleComplete} /> : null}
          </div>
        </div>
      </section>
    </main>
  )
}
