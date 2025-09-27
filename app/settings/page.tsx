"use client"

import * as React from "react"
import "@/lib/firebase" // ensure Firebase initialization
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/providers/locale-provider"

export default function SettingsPage() {
  const auth = React.useMemo(() => getAuth(), [])
  const storage = React.useMemo(() => getStorage(), [])

  const [user, setUser] = React.useState(auth.currentUser)
  const [displayName, setDisplayName] = React.useState<string>("")
  const [photoFile, setPhotoFile] = React.useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  const { locale, setLocale, t } = useLocale()

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setDisplayName(u?.displayName || "")
      setPhotoPreview(u?.photoURL || null)
    })
    return () => unsub()
  }, [auth])

  function onSelectPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setPhotoFile(f)
      const url = URL.createObjectURL(f)
      setPhotoPreview(url)
    }
  }

  async function compressImage(file: File, maxSize = 512, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      const url = URL.createObjectURL(file)
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Canvas unsupported")
          const { width, height } = img
          const scale = Math.min(1, maxSize / Math.max(width, height))
          const w = Math.round(width * scale)
          const h = Math.round(height * scale)
          canvas.width = w
          canvas.height = h
          ctx.drawImage(img, 0, 0, w, h)
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url)
              if (!blob) return reject(new Error("Compression failed"))
              resolve(blob)
            },
            "image/jpeg",
            quality,
          )
        } catch (err) {
          URL.revokeObjectURL(url)
          reject(err)
        }
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("Image load failed"))
      }
      img.src = url
    })
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!user) {
      setMessage(t("settings.profile.signinNeeded", "Please sign in to update your profile."))
      return
    }
    setSaving(true)

    try {
      const optimisticDisplayName = displayName
      const optimisticPhotoURL = photoPreview || user.photoURL || undefined
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-profile-updated", {
            detail: { displayName: optimisticDisplayName, photoURL: optimisticPhotoURL },
          }),
        )
      }
      setMessage(t("settings.profile.instantSaved", "Profile updated instantly"))
    } catch {
      // ignore
    }

    try {
      let newPhotoURL = user.photoURL || null
      if (photoFile) {
        const blob = await compressImage(photoFile, 512, 0.8)
        const ext = "jpg"
        const filePath = `avatars/${user.uid}-${Date.now()}.${ext}`
        const fileRef = ref(storage, filePath)
        await uploadBytes(fileRef, blob)
        newPhotoURL = await getDownloadURL(fileRef)
      }

      await updateProfile(user, {
        displayName: displayName || undefined,
        photoURL: newPhotoURL || undefined,
      })

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: displayName || null,
          photoURL: newPhotoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      await auth.currentUser?.reload()
      setUser(auth.currentUser)
    } catch (err: any) {
      setMessage(err?.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <main className="container mx-auto max-w-2xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.title", "Settings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("settings.profile.signinNeeded", "Please sign in to update your profile.")}
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  const initials = (user.displayName || user.email || "U").slice(0, 2).toUpperCase()

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.profile.title", "Profile Settings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSave}>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={photoPreview || user.photoURL || undefined} alt="Profile photo" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <Label htmlFor="photo">{t("settings.profile.photo", "Profile photo")}</Label>
                <Input id="photo" type="file" accept="image/*" onChange={onSelectPhoto} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="displayName">{t("settings.profile.username", "Username")}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("settings.profile.placeholder", "Enter your username")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language">{t("settings.language", "Language")}</Label>
              <select
                id="language"
                value={locale}
                onChange={(e) => setLocale(e.target.value as "en" | "hi")}
                className="h-10 rounded-md border border-[var(--color-border)] bg-background px-3 text-sm"
                aria-label={t("settings.language", "Language")}
              >
                <option value="en">{t("settings.language.english", "English")}</option>
                <option value="hi">{t("settings.language.hindi", "Hindi")}</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {t("settings.language.helper", "Choose your preferred language")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t("settings.profile.saving", "Saving...") : t("settings.profile.save", "Save changes")}
              </Button>
              {message ? <span className="text-sm text-muted-foreground">{message}</span> : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
