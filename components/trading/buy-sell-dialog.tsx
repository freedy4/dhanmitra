"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buyStock, sellStock, getWalletState } from "@/lib/demo-wallet"
import { TrendingUp, TrendingDown, DollarSign, Shapes as Shares } from "lucide-react"
import { cn } from "@/lib/utils"

interface BuySellDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  symbol: string
  currentPrice: number
  changePercent: number
  onTransactionComplete: () => void
}

export function BuySellDialog({
  open,
  onOpenChange,
  symbol,
  currentPrice,
  changePercent,
  onTransactionComplete,
}: BuySellDialogProps) {
  const [buyShares, setBuyShares] = useState("")
  const [sellShares, setSellShares] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const walletState = getWalletState()
  const holding = walletState.portfolio.find((p) => p.symbol === symbol)
  const maxBuyShares = Math.floor(walletState.balance / currentPrice)
  const maxSellShares = holding?.shares || 0

  const buyTotal = Number.parseFloat(buyShares) * currentPrice || 0
  const sellTotal = Number.parseFloat(sellShares) * currentPrice || 0

  const handleBuy = async () => {
    const shares = Number.parseFloat(buyShares)
    if (!shares || shares <= 0 || buyTotal > walletState.balance) return

    setIsProcessing(true)
    const success = buyStock(symbol, shares, currentPrice)
    if (success) {
      setBuyShares("")
      onTransactionComplete()
      onOpenChange(false)
    }
    setIsProcessing(false)
  }

  const handleSell = async () => {
    const shares = Number.parseFloat(sellShares)
    if (!shares || shares <= 0 || shares > maxSellShares) return

    setIsProcessing(true)
    const success = sellStock(symbol, shares, currentPrice)
    if (success) {
      setSellShares("")
      onTransactionComplete()
      onOpenChange(false)
    }
    setIsProcessing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Trade {symbol}
            <Badge
              variant={changePercent >= 0 ? "default" : "destructive"}
              className={cn(
                "text-xs",
                changePercent >= 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              )}
            >
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Current price: <span className="font-mono font-medium">${currentPrice.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-2">
              <TrendingDown className="h-4 w-4" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-shares">Number of Shares</Label>
              <Input
                id="buy-shares"
                type="number"
                placeholder="0"
                value={buyShares}
                onChange={(e) => setBuyShares(e.target.value)}
                min="0"
                max={maxBuyShares}
                step="1"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Max: {maxBuyShares} shares</span>
                <span>Available: ${walletState.balance.toFixed(2)}</span>
              </div>
            </div>

            {buyTotal > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Cost:
                  </span>
                  <span className="font-mono font-medium">${buyTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleBuy}
              disabled={!buyShares || buyTotal > walletState.balance || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : `Buy ${buyShares || 0} Shares`}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-shares">Number of Shares</Label>
              <Input
                id="sell-shares"
                type="number"
                placeholder="0"
                value={sellShares}
                onChange={(e) => setSellShares(e.target.value)}
                min="0"
                max={maxSellShares}
                step="1"
                disabled={maxSellShares === 0}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Max: {maxSellShares} shares</span>
                {holding && (
                  <span>
                    Avg Cost: ${holding.averagePrice.toFixed(2)} | P&L:{" "}
                    <span className={cn(holding.profitLoss >= 0 ? "text-green-600" : "text-red-600")}>
                      ${holding.profitLoss.toFixed(2)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {sellTotal > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shares className="h-4 w-4" />
                    Total Value:
                  </span>
                  <span className="font-mono font-medium">${sellTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleSell}
              disabled={!sellShares || Number.parseFloat(sellShares) > maxSellShares || isProcessing}
              className="w-full"
              variant={maxSellShares > 0 ? "destructive" : "secondary"}
            >
              {isProcessing
                ? "Processing..."
                : maxSellShares === 0
                  ? "No Shares to Sell"
                  : `Sell ${sellShares || 0} Shares`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
