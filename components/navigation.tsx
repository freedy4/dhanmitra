"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { BookOpen, Calculator, GamepadIcon, Home, LogOut, Menu, User, X, Settings, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TradingTicker } from "@/components/trading-ticker"
import { useLocale } from "@/components/providers/locale-provider"
import Image from "next/image"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    description: "Landing page",
  },
  {
    name: "Learning Hub",
    href: "/learn",
    icon: BookOpen,
    description: "Banking, Investment, Insurance & Taxation courses",
  },
  {
    name: "Fun Learn",
    href: "/fun-learn",
    icon: GamepadIcon,
    description: "Interactive demos and quizzes",
  },
  {
    name: "Trading",
    href: "/trading",
    icon: TrendingUp,
    description: "Real-time trading graphs and market data",
  },
  {
    name: "Calculator",
    href: "/calculator",
    icon: Calculator,
    description: "Finance and banking calculators",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "User settings",
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const { t } = useLocale()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleProfileUpdated = async (evt: Event) => {
      const ce = evt as CustomEvent<{ displayName?: string; photoURL?: string }>
      if (ce?.detail && (ce.detail.displayName || ce.detail.photoURL)) {
        setUser((prev: any) =>
          prev
            ? {
                ...prev,
                displayName: ce.detail.displayName ?? prev.displayName,
                photoURL: ce.detail.photoURL ?? prev.photoURL,
              }
            : prev,
        )
      }
      try {
        await auth.currentUser?.reload()
        setUser(auth.currentUser)
      } catch {
        // ignore
      }
    }
    window.addEventListener("user-profile-updated", handleProfileUpdated as EventListener)
    return () => window.removeEventListener("user-profile-updated", handleProfileUpdated as EventListener)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setIsOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Don't show navigation on auth, login, signup pages
  if (pathname === "/auth" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 rounded-lg bg-[var(--brand)] text-white shadow-lg md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-10 flex items-center">
            <TradingTicker className="flex-1" />
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-10 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="p-2 rounded-lg bg-[var(--brand)]/20">
                <Image
                  src="/images/dhanmitra-logo.jpg"
                  alt="DhanMitra Logo"
                  width={20}
                  height={20}
                  className="rounded"
                />
              </div>
              DhanMitra
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navigationItems
                .slice(1)
                .filter((item) => item.name !== "Settings")
                .map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  const key =
                    item.href === "/learn"
                      ? "nav.learn"
                      : item.href === "/fun-learn"
                        ? "nav.funLearn"
                        : item.href === "/trading"
                          ? "nav.trading"
                          : item.href === "/calculator"
                            ? "nav.calculator"
                            : "nav.home"
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-[var(--brand)]/20 text-[var(--brand)]"
                          : "hover:bg-background/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t(key, item.name)}
                    </Link>
                  )
                })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-1 ring-[var(--color-border)]">
                    {user?.photoURL ? (
                      <AvatarImage src={user.photoURL || "/placeholder.svg"} alt="User avatar" />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.displayName || user.email?.split("@")[0]}</span>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t("nav.settings", "Settings")}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout", "Sign Out")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
                  >
                    {t("auth.login", "Log In")}
                  </Link>
                  <Link href="/signup" className="btn-brand-outline text-sm">
                    {t("auth.signup", "Sign Up")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg" onClick={() => setIsOpen(false)}>
                <div className="p-2 rounded-lg bg-[var(--brand)]/20">
                  <Image
                    src="/images/dhanmitra-logo.jpg"
                    alt="DhanMitra Logo"
                    width={20}
                    height={20}
                    className="rounded"
                  />
                </div>
                DhanMitra
              </Link>
            </div>

            <div className="border-b border-[var(--color-border)] p-4">
              <div className="text-xs text-muted-foreground mb-2">{t("nav.liveData", "Live Market Data")}</div>
              <TradingTicker />
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {navigationItems
                  .filter((item) => item.name !== "Settings")
                  .map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const key =
                      item.href === "/learn"
                        ? "nav.learn"
                        : item.href === "/fun-learn"
                          ? "nav.funLearn"
                          : item.href === "/trading"
                            ? "nav.trading"
                            : item.href === "/calculator"
                              ? "nav.calculator"
                              : "nav.home"
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg transition-colors",
                          isActive ? "bg-[var(--brand)]/20 text-[var(--brand)]" : "hover:bg-background/60",
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{t(key, item.name)}</div>
                          <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                        </div>
                      </Link>
                    )
                  })}
              </div>
            </div>

            {/* User Section */}
            <div className="border-t border-[var(--color-border)] p-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-[var(--color-border)]">
                      {user?.photoURL ? (
                        <AvatarImage src={user.photoURL || "/placeholder.svg"} alt="User avatar" />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.displayName || "User"}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 w-full p-3 rounded-lg text-left hover:bg-background/60 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t("nav.settings", "Settings")}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full p-3 rounded-lg text-left hover:bg-background/60 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout", "Sign Out")}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full p-3 rounded-lg text-center border border-[var(--color-border)] hover:bg-background/60 transition-colors"
                  >
                    {t("auth.login", "Log In")}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="btn-brand-outline w-full text-center"
                  >
                    {t("auth.signup", "Sign Up")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block h-26" />
    </>
  )
}
