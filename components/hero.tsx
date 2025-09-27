"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NewsTicker } from "./news-ticker"

export function Hero() {
  return (
    <section
      aria-label="Banking app hero"
      className={cn("mx-auto max-w-6xl p-6 md:p-10 w-full flex items-center", "surface-card")}
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center">
          <h1 className={cn("text-pretty text-3xl md:text-5xl font-medium leading-tight")}>
            {"“Guiding You from Zero to Financial Hero.”"}
          </h1>
          <p className="mt-4 text-balance text-muted-foreground md:text-lg leading-relaxed">
            We turn financial illiteracy into confidence with personalized learning, practical tools, and gamified
            experiences — helping you make smarter decisions and build lasting wealth.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link href="/signup" className="btn-brand-outline hover-glow-blue">
              sign up
            </Link>
            <Link href="/login" className="btn-brand-outline hover-glow-green">
              log in
            </Link>
          </div>
        </div>

        <div className="relative">
          <NewsTicker />
        </div>
      </div>
    </section>
  )
}
