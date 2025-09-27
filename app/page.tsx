import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <main className="min-h-dvh app-bg text-foreground flex items-center">
      <header className="sr-only">
        <h1>DhanMitra</h1>
      </header>
      <Hero />
    </main>
  )
}
