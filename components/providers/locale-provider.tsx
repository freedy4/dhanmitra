"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { translate as baseTranslate } from "@/lib/i18n"
import { applyHindiTranslations, revertHindiTranslations } from "@/lib/auto-translate"

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, fallback?: string) => string
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

const STORAGE_KEY = "app:locale"

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved === "en" || saved === "hi") {
        setLocaleState(saved)
        document.documentElement.lang = saved
      } else {
        document.documentElement.lang = "en"
      }
    } catch {
      document.documentElement.lang = "en"
    }
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {}
    document.documentElement.lang = l
    window.dispatchEvent(new CustomEvent("app-locale-changed", { detail: { locale: l } }))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (locale === "hi") applyHindiTranslations()
    else revertHindiTranslations()
  }, [locale])

  const t = useCallback((key: string, fallback?: string) => baseTranslate(locale, key, fallback), [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
