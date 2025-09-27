"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/learn")
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
      <div className={cn("w-full max-w-md rounded-xl p-6 md:p-8", "ring-1 ring-[var(--brand)] glow-border")}>
        <h1 className={cn("text-2xl md:text-3xl font-medium glow-text")}>Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Log in using your email and password.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[var(--destructive)]">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className={cn("btn-brand-outline mt-1", busy && "opacity-70")}>
            {busy ? "Please wait…" : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <span>
            New here?{" "}
            <Link href="/signup" className="underline text-[var(--brand)]">
              Create an account
            </Link>
          </span>
        </div>

        <div className="mt-8">
          <Link href="/" className="btn-brand-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
