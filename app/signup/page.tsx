"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth, db, storage } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      let photoURL: string | undefined = undefined
      if (photoFile) {
        const safeExt = photoFile.name.split(".").pop() || "jpg"
        const avatarRef = ref(storage, `users/${cred.user.uid}/avatar.${safeExt}`)
        await uploadBytes(avatarRef, photoFile)
        photoURL = await getDownloadURL(avatarRef)
      }

      if (name.trim() || photoURL) {
        await updateProfile(cred.user, {
          displayName: name.trim() || undefined,
          photoURL,
        })
      }

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        name: name.trim() || null,
        photoURL: photoURL || null,
        createdAt: serverTimestamp(),
      })

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
        <h1 className={cn("text-2xl md:text-3xl font-medium glow-text")}>Create your account</h1>
        <p className="mt-2 text-muted-foreground">Sign up with email and a secure password.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              autoComplete="new-password"
              required
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="photo" className="text-sm">
              Profile photo (optional)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">PNG or JPG recommended. Max ~5MB.</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[var(--destructive)]">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className={cn("btn-brand-outline mt-1", busy && "opacity-70")}>
            {busy ? "Please wait…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <span>
            Already have an account?{" "}
            <Link href="/login" className="underline text-[var(--brand)]">
              Log in
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
