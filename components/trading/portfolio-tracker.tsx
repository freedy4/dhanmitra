"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  getWalletState,
  updatePortfolioValues,
  calculateWalletTotals,
  saveWalletState,
  resetWallet,
} from "@/lib/demo-wallet"
import type { WalletState } from "@/lib/demo-wallet"
import { TrendingUp, TrendingDown, Wallet, PieChart, RotateCcw, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface PortfolioTrackerProps {
  currentPrices: { [symbol: string]: number }
  onRefresh: () => void
}

export function PortfolioTracker({ currentPrices, onRefresh }: PortfolioTrackerProps) {
  const [walletState, setWalletState] = useState<WalletState>(() => getWalletState())

  useEffect(() => {
    // Update portfolio values with current prices
    const updatedPortfolio = updatePortfolioValues(walletState.portfolio, currentPrices)
    const totals = calculateWalletTotals(
      walletState.balance,
      updatedPortfolio,
      walletState.realizedProfitLoss || 0, // pass realized P&L
    )

    const newState: WalletState = {
      ...totals,
      portfolio: updatedPortfolio,
    }

    setWalletState(newState)
    saveWalletState(newState)
  }, [currentPrices, walletState.balance, walletState.realizedProfitLoss])

  const handleReset = () => {
    resetWallet()
    setWalletState(getWalletState())
    onRefresh()
  }

  const portfolioValue = walletState.totalValue - walletState.balance
  const cashPercentage = (walletState.balance / Math.max(walletState.totalValue, 0.0001)) * 100
  const investedPercentage = (portfolioValue / Math.max(walletState.totalValue, 0.0001)) * 100

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Demo Trading Account
              </CardTitle>
              <CardDescription>Virtual portfolio with $10,000 starting balance</CardDescription>
            </div>
            <Button onClick={handleReset} variant="outline" size="sm" className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${walletState.totalValue.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Cash Balance</p>
              <p className="text-xl font-semibold">${walletState.balance.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p
                className={cn(
                  "text-xl font-semibold",
                  walletState.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {walletState.totalProfitLoss >= 0 ? "+" : ""}${walletState.totalProfitLoss.toFixed(2)}
              </p>
              <div className="text-xs text-muted-foreground">
                Realized:{" "}
                <span
                  className={cn(walletState.realizedProfitLoss >= 0 ? "text-green-600" : "text-red-600", "font-medium")}
                >
                  {walletState.realizedProfitLoss >= 0 ? "+" : ""}${walletState.realizedProfitLoss.toFixed(2)}
                </span>{" "}
                · Unrealized:{" "}
                <span
                  className={cn(
                    walletState.unrealizedProfitLoss >= 0 ? "text-green-600" : "text-red-600",
                    "font-medium",
                  )}
                >
                  {walletState.unrealizedProfitLoss >= 0 ? "+" : ""}${walletState.unrealizedProfitLoss.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Return %</p>
              <div className="flex items-center gap-2">
                {walletState.totalProfitLossPercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={cn(
                    "text-xl font-semibold",
                    walletState.totalProfitLossPercent >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {walletState.totalProfitLossPercent >= 0 ? "+" : ""}
                  {walletState.totalProfitLossPercent.toFixed(2)}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Based on equity vs $10,000 starting balance</p>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="text-sm font-medium">Asset Allocation</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cash ({cashPercentage.toFixed(1)}%)</span>
                <span>Invested ({investedPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={investedPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Holdings */}
      {walletState.portfolio.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>Your current stock positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletState.portfolio.map((holding) => (
                <div
                  key={holding.symbol}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{holding.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {holding.shares} shares
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg: ${holding.averagePrice.toFixed(2)} | Current: ${holding.currentPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">${holding.totalValue.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      {holding.profitLoss >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          holding.profitLoss >= 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {holding.profitLoss >= 0 ? "+" : ""}${holding.profitLoss.toFixed(2)} (
                        {holding.profitLossPercent >= 0 ? "+" : ""}
                        {holding.profitLossPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty Portfolio State */}
      {walletState.portfolio.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Holdings Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start trading by selecting a stock and clicking the "Trade" button
            </p>
            <p className="text-sm text-muted-foreground">
              Available balance: <span className="font-medium">${walletState.balance.toFixed(2)}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
