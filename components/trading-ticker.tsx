"use client"

import useSWR from "swr"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

type StockData = {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TradingTicker({ className }: { className?: string }) {
  const { data, isLoading } = useSWR<{ stocks: StockData[] }>("/api/trading", fetcher, {
    refreshInterval: 30000, // refresh every 30 seconds
    revalidateOnFocus: false,
  })

  const stocks = data?.stocks ?? []

  if (isLoading || stocks.length === 0) {
    return (
      <div className={cn("flex items-center gap-4 overflow-hidden", className)}>
        <div className="flex items-center gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-12 bg-muted/40 rounded" />
              <div className="h-3 w-16 bg-muted/40 rounded" />
              <div className="h-3 w-12 bg-muted/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-6 overflow-hidden", className)}>
      <div className="flex items-center gap-6 animate-scroll">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-medium text-sm">{stock.symbol}</span>
            <span className="text-sm font-mono">${stock.price.toFixed(2)}</span>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                stock.changePercent >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {stock.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {stock.changePercent >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
