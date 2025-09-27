"use client"

import { cn } from "@/lib/utils"
import type { Lesson } from "./types"

function getYoutubeId(link?: string): string | null {
  if (!link) return null
  try {
    // handles embed links: https://www.youtube.com/embed/{id}?...
    const embedMatch = link.match(/\/embed\/([^?&/]+)/)
    if (embedMatch?.[1]) return embedMatch[1]

    // handles youtu.be links: https://youtu.be/{id}?...
    const shortMatch = link.match(/youtu\.be\/([^?&/]+)/)
    if (shortMatch?.[1]) return shortMatch[1]

    // handles shorts links: https://www.youtube.com/shorts/{id}
    const shortsMatch = link.match(/youtube\.com\/shorts\/([^?&/]+)/)
    if (shortsMatch?.[1]) return shortsMatch[1]

    // handles watch links: https://www.youtube.com/watch?v={id}
    const url = new URL(link)
    const v = url.searchParams.get("v")
    if (v) return v

    return null
  } catch {
    return null
  }
}

export function LessonCard({
  lesson,
  active,
  completed,
  onSelect,
}: {
  lesson: Lesson
  active: boolean
  completed: boolean
  onSelect: (id: string) => void
}) {
  const ytId = lesson.type === "video" ? getYoutubeId(lesson.link) : null
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null

  return (
    <button
      onClick={() => onSelect(lesson.id)}
      className={cn(
        "w-full text-left rounded-md border p-3 transition-colors surface-card",
        active ? "border-[var(--brand)]" : "border-muted",
        completed ? "opacity-90" : "opacity-100",
        "hover:border-[var(--brand)]/70",
      )}
    >
      <div className="flex items-start gap-3">
        {thumb ? (
          <img
            src={thumb || "/placeholder.svg?height=90&width=160&query=video thumbnail placeholder"}
            alt={`${lesson.title} thumbnail`}
            className="h-12 w-20 rounded object-cover border border-muted shrink-0"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget
              // prevent infinite fallback loop
              if (img.dataset.fallback !== "1" && ytId) {
                img.dataset.fallback = "1"
                img.src = `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`
              }
            }}
          />
        ) : null}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base">{lesson.title}</span>
            <span className={cn("ml-3 h-2 w-2 rounded-full", completed ? "bg-[var(--brand)]" : "bg-muted")} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{lesson.type}</p>
        </div>
      </div>
    </button>
  )
}
