import { NextResponse } from "next/server"

// Function to build synthetic chart data
function buildSyntheticChartData(symbol: string) {
  const days = 30
  const dayMs = 24 * 60 * 60 * 1000
  const now = Date.now()
  let price = 100 + Math.random() * 50
  const out: {
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(now - i * dayMs)
    const change = (Math.random() - 0.5) * 2
    const open = price
    const close = Math.max(1, open + change)
    const high = Math.max(open, close) + Math.random() * 1.5
    const low = Math.min(open, close) - Math.random() * 1.5
    const volume = 1_000_000 + Math.floor(Math.random() * 500_000)
    out.push({
      time: t.toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    })
    price = close
  }
  return out
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "AAPL"
    const resolution = searchParams.get("resolution") || "D"

    const apiKey = process.env.FINNHUB_KEY

    // If no key, return synthetic data to keep charts working
    if (!apiKey) {
      const data = buildSyntheticChartData(symbol)
      return NextResponse.json({ data, source: "synthetic" }, { status: 200 })
    }

    // Get historical data for the last 30 days
    const to = Math.floor(Date.now() / 1000)
    const from = to - 30 * 24 * 60 * 60

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      // Graceful fallback for auth/permission/rate-limit
      if (response.status === 401 || response.status === 403) {
        const data = buildSyntheticChartData(symbol)
        return NextResponse.json({ data, source: "synthetic" }, { status: 200 })
      }
      // For other errors, also fall back without throwing
      const data = buildSyntheticChartData(symbol)
      return NextResponse.json({ data, source: "synthetic" }, { status: 200 })
    }

    const data = await response.json()

    // Transform data for chart
    const chartData =
      data.t?.map((timestamp: number, index: number) => ({
        time: new Date(timestamp * 1000).toISOString().split("T")[0],
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
      })) || []

    if (data.s === "no_data" || chartData.length === 0) {
      const fallback = buildSyntheticChartData(symbol)
      return NextResponse.json({ data: fallback, source: "synthetic" }, { status: 200 })
    }

    return NextResponse.json({ data: chartData, source: "finnhub" }, { status: 200 })
  } catch {
    // On error, return synthetic data to avoid empty chart
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "AAPL"
    const data = buildSyntheticChartData(symbol)
    return NextResponse.json({ data, source: "synthetic" }, { status: 200 })
  }
}
