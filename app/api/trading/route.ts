import { NextResponse } from "next/server"

type StockData = {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const SYMBOLS = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA"]

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_KEY
    if (!apiKey) {
      // No API key configured: return zeros without hitting the network
      const stocks = SYMBOLS.map((symbol) => ({
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
      }))
      return NextResponse.json({ stocks }, { status: 200 })
    }

    const promises = SYMBOLS.map(async (symbol) => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          // Handle auth/permission issues quietly and fall back to zeros
          if (response.status === 401 || response.status === 403) {
            return { symbol, price: 0, change: 0, changePercent: 0 }
          }
          throw new Error(`Failed to fetch ${symbol}`)
        }

        const data = await response.json()

        return {
          symbol,
          price: data.c || 0,
          change: data.d || 0,
          changePercent: data.dp || 0,
        }
      } catch {
        return { symbol, price: 0, change: 0, changePercent: 0 }
      }
    })

    const stocks = await Promise.all(promises)
    return NextResponse.json({ stocks })
  } catch {
    return NextResponse.json({ stocks: [] }, { status: 200 })
  }
}
