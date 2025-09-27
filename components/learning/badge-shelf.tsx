"use client"

const BADGES = [
  { id: "starter", name: "Starter", minXp: 50, color: "text-blue-300" },
  { id: "learner", name: "Learner", minXp: 120, color: "text-green-300" },
  { id: "pro", name: "Pro", minXp: 250, color: "text-pink-300" },
]

export function BadgeShelf({ xp }: { xp: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BADGES.map((b) => {
        const active = xp >= b.minXp
        return (
          <div
            key={b.id}
            className={`rounded-md border px-2 py-1 text-xs ${active ? b.color : "text-muted-foreground border-muted"}`}
            aria-label={`${b.name} badge ${active ? "earned" : "locked"}`}
          >
            {active ? "● " : "○ "} {b.name}
          </div>
        )
      })}
    </div>
  )
}
