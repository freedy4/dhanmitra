"use client"

import { cn } from "@/lib/utils"
import type { UserRating } from "./types"

export function ProgressBar({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cn("h-2 w-full rounded-full bg-muted/40", className)}>
      <div className="h-full rounded-full bg-[var(--brand)] transition-[width]" style={{ width: `${v}%` }} />
    </div>
  )
}

export function XpPill({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center rounded-full border border-muted px-3 py-1 text-xs text-muted-foreground">
      XP: <span className="ml-1 font-medium text-foreground">{xp}</span>
    </span>
  )
}

export function RatingBadge({ rating }: { rating?: UserRating }) {
  if (!rating) return null

  const getRatingStyles = (rating: UserRating) => {
    switch (rating) {
      case "Pro":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "Learner":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case "Starter":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        getRatingStyles(rating),
      )}
    >
      {rating}
    </span>
  )
}
