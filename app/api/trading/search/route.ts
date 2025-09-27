import { NextResponse } from "next/server"

type FinnhubSearchItem = {
  symbol: string
  description: string
  type?: string
}

type Quote = {
  c?: number
  d?: number
  dp?: number
  h?: number
  l?: number
  o?: number
  pc?: number
}

type Profile2 = {
  name?: string
  ticker?: string
  exchange?: string
  currency?: string
  country?: string
  ipo?: string
  marketCapitalization?: number
  weburl?: string
  logo?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").trim()
  if (!q) return NextResponse.json({ results: [] })

  const apiKey = process.env.FINNHUB_KEY
  if (!apiKey) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search for symbols first
    const searchRes = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${apiKey}`, {
      cache: "no-store",
    })

    if (!searchRes.ok) {
      return NextResponse.json({ results: [] })
    }

    const searchJson = await searchRes.json()
    const raw: FinnhubSearchItem[] = Array.isArray(searchJson?.result) ? searchJson.result : []

    // Take the top few results to avoid overfetching
    const top = raw.slice(0, 5)
    const results = await Promise.all(
      top.map(async (item) => {
        const symbol = item.symbol

        const [quoteRes, profileRes] = await Promise.allSettled([
          fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`, {
            cache: "no-store",
          }),
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`, {
            cache: "no-store",
          }),
        ])

        let quote: Quote | null = null
        if (quoteRes.status === "fulfilled" && quoteRes.value.ok) {
          try {
            quote = await quoteRes.value.json()
          } catch {
            quote = null
          }
        }

        let profile: Profile2 | null = null
        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          try {
            profile = await profileRes.value.json()
          } catch {
            profile = null
          }
        }

        return {
          symbol,
          name: profile?.name || item.description || symbol,
          exchange: profile?.exchange || null,
          currency: profile?.currency || null,
          country: profile?.country || null,
          ipo: profile?.ipo || null,
          marketCap: profile?.marketCapitalization ?? null,
          weburl: profile?.weburl || null,
          logo: profile?.logo || null,
          quote: {
            price: quote?.c ?? null,
            change: quote?.d ?? null,
            changePercent: quote?.dp ?? null,
            high: quote?.h ?? null,
            low: quote?.l ?? null,
            open: quote?.o ?? null,
            prevClose: quote?.pc ?? null,
          },
        }
      }),
    )

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
