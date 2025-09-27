"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, RefreshCw, ShoppingCart } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import { BuySellDialog } from "@/components/trading/buy-sell-dialog"
import { PortfolioTracker } from "@/components/trading/portfolio-tracker"

type StockData = {
  symbol: string
  price: number
  change: number
  changePercent: number
}

type HistoricalData = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type SearchResult = {
  symbol: string
  name: string | null
  exchange: string | null
  currency: string | null
  country: string | null
  ipo: string | null
  marketCap: number | null
  weburl: string | null
  logo: string | null
  quote: {
    price: number | null
    change: number | null
    changePercent: number | null
    high: number | null
    low: number | null
    open: number | null
    prevClose: number | null
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const POPULAR_STOCKS = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "NFLX"]

export default function TradingPage() {
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [tradingDialogOpen, setTradingDialogOpen] = useState(false)
  const [walletRefreshKey, setWalletRefreshKey] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const {
    data: liveData,
    isLoading: liveLoading,
    mutate: mutateLive,
  } = useSWR<{ stocks: StockData[] }>("/api/trading", fetcher, { refreshInterval: 30000 })

  const {
    data: historicalData,
    isLoading: historicalLoading,
    mutate: mutateHistorical,
  } = useSWR<{ data: HistoricalData[] }>(`/api/trading/historical?symbol=${selectedStock}&resolution=D`, fetcher)

  const currentStock = liveData?.stocks?.find((stock) => stock.symbol === selectedStock)
  const chartData = historicalData?.data || []

  const currentPrices =
    liveData?.stocks?.reduce(
      (acc, stock) => {
        acc[stock.symbol] = stock.price
        return acc
      },
      {} as { [symbol: string]: number },
    ) || {}

  const handleRefresh = () => {
    mutateLive()
    mutateHistorical()
    setWalletRefreshKey((prev) => prev + 1)
  }

  const handleTransactionComplete = () => {
    setWalletRefreshKey((prev) => prev + 1)
  }

  async function handleStockSearch() {
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults([])
      return
    }
    try {
      setSearchLoading(true)
      setSearchError(null)
      const res = await fetch(`/api/trading/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      const results: SearchResult[] = Array.isArray(data?.results) ? data.results : []
      const filtered = results.filter((r) => r.symbol !== selectedStock && !POPULAR_STOCKS.includes(r.symbol))
      setSearchResults(filtered)
    } catch (e: any) {
      setSearchError(e?.message || "Failed to search stocks.")
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Demo Trading Platform</h1>
              <p className="text-muted-foreground mt-2">Practice trading with $10,000 virtual money</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <PortfolioTracker currentPrices={currentPrices} onRefresh={handleRefresh} key={walletRefreshKey} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stock Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Stock</CardTitle>
                <CardDescription>Choose a stock to view detailed charts and trade</CardDescription>
                <div className="mt-2">
                  <Button variant="secondary" size="sm" onClick={() => setShowSearch((v) => !v)}>
                    {showSearch ? "Close Search" : "Search other stocks"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showSearch && (
                  <div className="mb-4 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by symbol or name (e.g., NKE, TSMC)"
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                        aria-label="Search stocks"
                      />
                      <Button size="sm" onClick={handleStockSearch} disabled={searchLoading}>
                        {searchLoading ? "Searching..." : "Search"}
                      </Button>
                    </div>
                    {searchError && <p className="mt-2 text-sm text-red-600">{searchError}</p>}
                    <div className="mt-3 grid gap-3">
                      {searchResults.length === 0 && !searchLoading && !searchError ? (
                        <p className="text-sm text-muted-foreground">Enter a query to find other stocks.</p>
                      ) : null}
                      {searchResults.map((r) => (
                        <div key={r.symbol} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-base font-semibold">
                                {r.symbol}
                                {r.name ? <span className="ml-2 text-sm text-muted-foreground">({r.name})</span> : null}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                {r.exchange ? <span>Exchange: {r.exchange}</span> : null}
                                {r.currency ? <span>Currency: {r.currency}</span> : null}
                                {r.country ? <span>Country: {r.country}</span> : null}
                                {r.ipo ? <span>IPO: {r.ipo}</span> : null}
                                {typeof r.marketCap === "number" ? (
                                  <span>Market Cap: {r.marketCap.toLocaleString()}</span>
                                ) : null}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-mono">
                                {typeof r.quote.price === "number" ? `$${r.quote.price.toFixed(2)}` : "—"}
                              </div>
                              {typeof r.quote.changePercent === "number" ? (
                                <div
                                  className={cn(
                                    "text-xs font-medium",
                                    r.quote.changePercent >= 0 ? "text-green-600" : "text-red-600",
                                  )}
                                >
                                  {r.quote.changePercent >= 0 ? "+" : ""}
                                  {r.quote.changePercent.toFixed(2)}%
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">No change data</div>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded bg-muted/40 p-2">Open: {r.quote.open ?? "—"}</div>
                            <div className="rounded bg-muted/40 p-2">Prev Close: {r.quote.prevClose ?? "—"}</div>
                            <div className="rounded bg-muted/40 p-2">High: {r.quote.high ?? "—"}</div>
                            <div className="rounded bg-muted/40 p-2">Low: {r.quote.low ?? "—"}</div>
                            {r.weburl ? (
                              <a
                                href={r.weburl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded bg-muted/40 p-2 underline"
                              >
                                Website
                              </a>
                            ) : (
                              <div className="rounded bg-muted/40 p-2">Website: —</div>
                            )}
                          </div>
                          <div className="mt-3 flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStock(r.symbol)
                                setShowSearch(false)
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  {POPULAR_STOCKS.map((symbol) => {
                    const stock = liveData?.stocks?.find((s) => s.symbol === symbol)
                    const isSelected = selectedStock === symbol

                    return (
                      <button
                        key={symbol}
                        onClick={() => setSelectedStock(symbol)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors text-left",
                          isSelected ? "border-[var(--brand)] bg-[var(--brand)]/10" : "border-border hover:bg-muted/50",
                        )}
                      >
                        <div>
                          <div className="font-medium">{symbol}</div>
                          {stock && <div className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</div>}
                        </div>
                        {stock && (
                          <Badge
                            variant={stock.changePercent >= 0 ? "default" : "destructive"}
                            className={cn(
                              "text-xs",
                              stock.changePercent >= 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                            )}
                          >
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Price Card */}
            {currentStock && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedStock}</CardTitle>
                    <div className="flex items-center gap-2">
                      {currentStock.changePercent >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <Badge
                        variant={currentStock.changePercent >= 0 ? "default" : "destructive"}
                        className={cn(
                          currentStock.changePercent >= 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                        )}
                      >
                        {currentStock.changePercent >= 0 ? "+" : ""}
                        {currentStock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4">
                      <div className="text-4xl font-bold">${currentStock.price.toFixed(2)}</div>
                      <div
                        className={cn(
                          "text-lg font-medium",
                          currentStock.change >= 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {currentStock.change >= 0 ? "+" : ""}
                        {currentStock.change.toFixed(2)}
                      </div>
                    </div>
                    <Button onClick={() => setTradingDialogOpen(true)} className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Trade
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            )}

            {/* Historical Chart */}
            <Card>
              <CardHeader>
                <CardTitle>30-Day Price Chart</CardTitle>
                <CardDescription>Historical price data for {selectedStock}</CardDescription>
              </CardHeader>
              <CardContent>
                {historicalLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          domain={["dataMin - 5", "dataMax + 5"]}
                          tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Close Price"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke="#ffffff"
                          strokeWidth={2.25}
                          strokeOpacity={1}
                          dot={false}
                          isAnimationActive={true}
                          animationDuration={600}
                          animationEasing="ease-in-out"
                          activeDot={{
                            r: 4,
                            fill: "#ffffff",
                            stroke: "hsl(var(--background))",
                            strokeWidth: 1,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-muted-foreground">No chart data available</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Market Ticker */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Live Market Data</CardTitle>
            <CardDescription>Real-time prices updating every 30 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            {liveLoading ? (
              <div className="flex items-center gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-muted/40 rounded" />
                    <div className="h-4 w-16 bg-muted/40 rounded" />
                    <div className="h-4 w-12 bg-muted/40 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {liveData?.stocks?.map((stock) => (
                  <div key={stock.symbol} className="p-3 rounded-lg border border-border">
                    <div className="font-medium text-sm">{stock.symbol}</div>
                    <div className="text-lg font-mono">${stock.price.toFixed(2)}</div>
                    <div
                      className={cn(
                        "text-xs font-medium flex items-center gap-1",
                        stock.changePercent >= 0 ? "text-green-600" : "text-red-600",
                      )}
                    >
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buy/Sell Dialog */}
        {currentStock && (
          <BuySellDialog
            open={tradingDialogOpen}
            onOpenChange={setTradingDialogOpen}
            symbol={selectedStock}
            currentPrice={currentStock.price}
            changePercent={currentStock.changePercent}
            onTransactionComplete={handleTransactionComplete}
          />
        )}
      </div>
    </div>
  )
}
