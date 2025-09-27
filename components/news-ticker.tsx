"use client"

import useSWR from "swr"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type NewsItem = {
  title: string
  link: string
  pubDate?: string
  source?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NewsTicker({ className }: { className?: string }) {
  const { data, isLoading } = useSWR<{ items: NewsItem[] }>("/api/news", fetcher, {
    refreshInterval: 1000 * 60 * 5, // refresh every 5 minutes
    revalidateOnFocus: false,
  })

  const items = useMemo(() => data?.items ?? [], [data])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!items.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, 5000) // 5 seconds
    return () => clearInterval(id)
  }, [items.length])

  const current = items[index]

  return (
    <aside
      aria-label="Latest in banking, investments, and stocks"
      className={cn("rounded-lg p-4 md:p-6 h-64 md:h-full w-full flex flex-col surface-card", className)}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className={cn("text-sm md:text-base font-mono tracking-wide")}>latest finance news</h2>
        <span className="text-xs text-muted-foreground">auto-updating</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* Skeleton while loading */}
        {isLoading || !current ? (
          <ul className="animate-pulse space-y-2">
            <li className="h-3 rounded bg-muted/40" />
            <li className="h-3 rounded bg-muted/40 w-5/6" />
            <li className="h-3 rounded bg-muted/40 w-2/3" />
            <li className="h-3 rounded bg-muted/40 w-4/5" />
          </ul>
        ) : (
          <div
            key={index}
            className={cn("absolute inset-0 transition-opacity duration-700", "opacity-0 data-[show=true]:opacity-100")}
            data-show={true}
          >
            <Link
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-pretty text-base md:text-lg font-medium hover:underline underline-offset-4 hover-glow-white",
              )}
            >
              {current.title}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {current.source ? current.source : "Source"}{" "}
              {current.pubDate ? `• ${new Date(current.pubDate).toLocaleString()}` : ""}
            </p>

            {/* Dots indicator */}
            {items.length > 1 ? (
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 py-2">
                {items.slice(0, 6).map((_, i) => (
                  <span
                    key={i}
                    aria-label={i === index ? "current headline" : "headline"}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      i === index ? "bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" : "bg-muted",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  )
}
