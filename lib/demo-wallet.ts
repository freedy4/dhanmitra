export interface Portfolio {
  symbol: string
  shares: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface WalletState {
  balance: number
  totalInvested: number
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  portfolio: Portfolio[]
  realizedProfitLoss: number
  unrealizedProfitLoss: number
}

const INITIAL_BALANCE = 10000
const WALLET_STORAGE_KEY = "demo-wallet-state"

export function getWalletState(): WalletState {
  if (typeof window === "undefined") {
    return {
      balance: INITIAL_BALANCE,
      totalInvested: 0,
      totalValue: INITIAL_BALANCE,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      portfolio: [],
      realizedProfitLoss: 0,
      unrealizedProfitLoss: 0,
    }
  }

  const stored = localStorage.getItem(WALLET_STORAGE_KEY)
  if (!stored) {
    const initialState: WalletState = {
      balance: INITIAL_BALANCE,
      totalInvested: 0,
      totalValue: INITIAL_BALANCE,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      portfolio: [],
      realizedProfitLoss: 0,
      unrealizedProfitLoss: 0,
    }
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(initialState))
    return initialState
  }

  return JSON.parse(stored)
}

export function saveWalletState(state: WalletState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state))
  }
}

export function updatePortfolioValues(
  portfolio: Portfolio[],
  currentPrices: { [symbol: string]: number },
): Portfolio[] {
  return portfolio.map((holding) => {
    const currentPrice = currentPrices[holding.symbol] || holding.currentPrice
    const totalValue = holding.shares * currentPrice
    const profitLoss = totalValue - holding.shares * holding.averagePrice
    const profitLossPercent = ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100

    return {
      ...holding,
      currentPrice,
      totalValue,
      profitLoss,
      profitLossPercent,
    }
  })
}

export function calculateWalletTotals(
  balance: number,
  portfolio: Portfolio[],
  realizedProfitLoss: number,
): Omit<WalletState, "portfolio"> {
  const totalInvested = portfolio.reduce((sum, holding) => sum + holding.shares * holding.averagePrice, 0)
  const portfolioValue = portfolio.reduce((sum, holding) => sum + holding.totalValue, 0)
  const totalValue = balance + portfolioValue
  const unrealizedProfitLoss = portfolio.reduce((sum, holding) => sum + holding.profitLoss, 0)
  const totalProfitLoss = realizedProfitLoss + unrealizedProfitLoss

  const totalProfitLossPercent = INITIAL_BALANCE > 0 ? ((totalValue - INITIAL_BALANCE) / INITIAL_BALANCE) * 100 : 0

  return {
    balance,
    totalInvested,
    totalValue,
    totalProfitLoss,
    totalProfitLossPercent,
    realizedProfitLoss,
    unrealizedProfitLoss,
  }
}

export function buyStock(symbol: string, shares: number, price: number): boolean {
  const state = getWalletState()
  const totalCost = shares * price

  if (totalCost > state.balance) {
    return false // Insufficient funds
  }

  state.balance -= totalCost

  const existingHolding = state.portfolio.find((p) => p.symbol === symbol)
  if (existingHolding) {
    const totalShares = existingHolding.shares + shares
    const totalCostBasis = existingHolding.shares * existingHolding.averagePrice + totalCost
    existingHolding.shares = totalShares
    existingHolding.averagePrice = totalCostBasis / totalShares
    existingHolding.currentPrice = price
    existingHolding.totalValue = totalShares * price
    existingHolding.profitLoss = existingHolding.totalValue - totalCostBasis
    existingHolding.profitLossPercent = ((price - existingHolding.averagePrice) / existingHolding.averagePrice) * 100
  } else {
    state.portfolio.push({
      symbol,
      shares,
      averagePrice: price,
      currentPrice: price,
      totalValue: totalCost,
      profitLoss: 0,
      profitLossPercent: 0,
    })
  }

  const totals = calculateWalletTotals(state.balance, state.portfolio, state.realizedProfitLoss || 0)
  Object.assign(state, totals)

  saveWalletState(state)
  return true
}

export function sellStock(symbol: string, shares: number, price: number): boolean {
  const state = getWalletState()
  const holding = state.portfolio.find((p) => p.symbol === symbol)

  if (!holding || holding.shares < shares) {
    return false // Insufficient shares
  }

  const saleValue = shares * price
  state.balance += saleValue

  const realized = (price - holding.averagePrice) * shares
  state.realizedProfitLoss = (state.realizedProfitLoss || 0) + realized

  if (holding.shares === shares) {
    state.portfolio = state.portfolio.filter((p) => p.symbol !== symbol)
  } else {
    holding.shares -= shares
    holding.totalValue = holding.shares * price
    holding.profitLoss = holding.totalValue - holding.shares * holding.averagePrice
    holding.profitLossPercent = ((price - holding.averagePrice) / holding.averagePrice) * 100
  }

  const totals = calculateWalletTotals(state.balance, state.portfolio, state.realizedProfitLoss || 0)
  Object.assign(state, totals)

  saveWalletState(state)
  return true
}

export function resetWallet(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(WALLET_STORAGE_KEY)
  }
}
