"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { Calculator, TrendingUp, PiggyBank, CreditCard, Target, BarChart3, Percent } from "lucide-react"

interface CalculatorResult {
  title: string
  value: string
  details?: string[]
}

const calculators = [
  {
    id: "compound-interest",
    title: "Compound Interest Calculator",
    icon: TrendingUp,
    description: "Calculate how your investments grow over time with compound interest",
    category: "Investment",
  },
  {
    id: "sip",
    title: "SIP Calculator",
    icon: BarChart3,
    description: "Plan your systematic investment plan returns",
    category: "Investment",
  },
  {
    id: "loan-emi",
    title: "Loan EMI Calculator",
    icon: CreditCard,
    description: "Calculate monthly EMI for home, car, or personal loans",
    category: "Banking",
  },
  {
    id: "fd-calculator",
    title: "Fixed Deposit Calculator",
    icon: PiggyBank,
    description: "Calculate returns on your fixed deposit investments",
    category: "Banking",
  },
  {
    id: "retirement",
    title: "Retirement Planning",
    icon: Target,
    description: "Plan how much you need to save for retirement",
    category: "Planning",
  },
  {
    id: "tax-calculator",
    title: "Income Tax Calculator",
    icon: Percent,
    description: "Calculate your income tax liability for FY 2024-25",
    category: "Taxation",
  },
]

function CompoundInterestCalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [principal, setPrincipal] = useState<number>(100000)
  const [rate, setRate] = useState<number>(12)
  const [time, setTime] = useState<number>(10)
  const [frequency, setFrequency] = useState<number>(12)

  const calculate = () => {
    const r = rate / 100
    const n = frequency
    const t = time
    const amount = principal * Math.pow(1 + r / n, n * t)
    const interest = amount - principal

    onResult({
      title: "Compound Interest Result",
      value: `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Principal Amount: ₹${principal.toLocaleString("en-IN")}`,
        `Interest Earned: ₹${interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Total Return: ${((interest / principal) * 100).toFixed(1)}%`,
        `Annual Growth Rate: ${rate}%`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Period (years)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          >
            <option value={1}>Annually</option>
            <option value={2}>Semi-annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate Compound Interest
      </button>
    </div>
  )
}

function SIPCalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000)
  const [expectedReturn, setExpectedReturn] = useState<number>(12)
  const [timePeriod, setTimePeriod] = useState<number>(10)

  const calculate = () => {
    const monthlyRate = expectedReturn / 12 / 100
    const months = timePeriod * 12
    const futureValue =
      monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
    const totalInvestment = monthlyInvestment * months
    const totalReturns = futureValue - totalInvestment

    onResult({
      title: "SIP Calculator Result",
      value: `₹${futureValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Monthly Investment: ₹${monthlyInvestment.toLocaleString("en-IN")}`,
        `Total Investment: ₹${totalInvestment.toLocaleString("en-IN")}`,
        `Total Returns: ₹${totalReturns.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Expected Annual Return: ${expectedReturn}%`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Period (years)</label>
          <input
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate SIP Returns
      </button>
    </div>
  )
}

function LoanEMICalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [loanAmount, setLoanAmount] = useState<number>(2500000)
  const [interestRate, setInterestRate] = useState<number>(8.5)
  const [tenure, setTenure] = useState<number>(20)

  const calculate = () => {
    const monthlyRate = interestRate / 12 / 100
    const months = tenure * 12
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalAmount = emi * months
    const totalInterest = totalAmount - loanAmount

    onResult({
      title: "Loan EMI Result",
      value: `₹${emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Loan Amount: ₹${loanAmount.toLocaleString("en-IN")}`,
        `Total Interest: ₹${totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Total Amount: ₹${totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Interest Rate: ${interestRate}% per annum`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Loan Amount (₹)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Interest Rate (% per annum)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Loan Tenure (years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate EMI
      </button>
    </div>
  )
}

function FDCalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [principal, setPrincipal] = useState<number>(100000)
  const [rate, setRate] = useState<number>(6.5)
  const [tenure, setTenure] = useState<number>(5)

  const calculate = () => {
    const maturityAmount = principal * Math.pow(1 + rate / 100, tenure)
    const interest = maturityAmount - principal

    onResult({
      title: "Fixed Deposit Result",
      value: `₹${maturityAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Principal Amount: ₹${principal.toLocaleString("en-IN")}`,
        `Interest Earned: ₹${interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Interest Rate: ${rate}% per annum`,
        `Tenure: ${tenure} years`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Interest Rate (% per annum)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tenure (years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate FD Returns
      </button>
    </div>
  )
}

function RetirementCalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [currentAge, setCurrentAge] = useState<number>(30)
  const [retirementAge, setRetirementAge] = useState<number>(60)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000)
  const [expectedReturn, setExpectedReturn] = useState<number>(10)

  const calculate = () => {
    const yearsToRetirement = retirementAge - currentAge
    const annualExpenses = monthlyExpenses * 12
    const inflationRate = 6 // Assuming 6% inflation
    const futureExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
    const corpusRequired = futureExpenses * 25 // 25x rule
    const monthlyInvestment =
      (corpusRequired * (expectedReturn / 12 / 100)) /
      (Math.pow(1 + expectedReturn / 12 / 100, yearsToRetirement * 12) - 1)

    onResult({
      title: "Retirement Planning Result",
      value: `₹${monthlyInvestment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Corpus Required: ₹${corpusRequired.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Years to Retirement: ${yearsToRetirement} years`,
        `Future Monthly Expenses: ₹${(futureExpenses / 12).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Expected Return: ${expectedReturn}% per annum`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Current Age</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Retirement Age</label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current Monthly Expenses (₹)</label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Expected Return (%)</label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate Monthly Investment Needed
      </button>
    </div>
  )
}

function TaxCalculator({ onResult }: { onResult: (result: CalculatorResult) => void }) {
  const [income, setIncome] = useState<number>(1200000)
  const [regime, setRegime] = useState<string>("new")
  const [deductions, setDeductions] = useState<number>(150000)

  const calculate = () => {
    let tax = 0
    let effectiveIncome = income

    if (regime === "old") {
      effectiveIncome = income - deductions
    }

    // New Tax Regime Slabs (FY 2024-25)
    if (regime === "new") {
      if (effectiveIncome > 1500000) {
        tax = (effectiveIncome - 1500000) * 0.3 + 187500
      } else if (effectiveIncome > 1200000) {
        tax = (effectiveIncome - 1200000) * 0.25 + 112500
      } else if (effectiveIncome > 900000) {
        tax = (effectiveIncome - 900000) * 0.2 + 52500
      } else if (effectiveIncome > 600000) {
        tax = (effectiveIncome - 600000) * 0.15 + 22500
      } else if (effectiveIncome > 300000) {
        tax = (effectiveIncome - 300000) * 0.1 + 7500
      } else if (effectiveIncome > 250000) {
        tax = (effectiveIncome - 250000) * 0.05
      }
    } else {
      // Old Tax Regime Slabs
      if (effectiveIncome > 1000000) {
        tax = (effectiveIncome - 1000000) * 0.3 + 112500
      } else if (effectiveIncome > 500000) {
        tax = (effectiveIncome - 500000) * 0.2 + 12500
      } else if (effectiveIncome > 250000) {
        tax = (effectiveIncome - 250000) * 0.05
      }
    }

    // Add 4% Health and Education Cess
    const cess = tax * 0.04
    const totalTax = tax + cess

    onResult({
      title: "Income Tax Calculation",
      value: `₹${totalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      details: [
        `Gross Income: ₹${income.toLocaleString("en-IN")}`,
        `Taxable Income: ₹${effectiveIncome.toLocaleString("en-IN")}`,
        `Tax (before cess): ₹${tax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Health & Education Cess: ₹${cess.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        `Tax Regime: ${regime === "new" ? "New" : "Old"}`,
      ],
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Income (₹)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tax Regime</label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
          >
            <option value="new">New Tax Regime</option>
            <option value="old">Old Tax Regime</option>
          </select>
        </div>
        {regime === "old" && (
          <div>
            <label className="block text-sm font-medium mb-2">Deductions (₹)</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
            />
          </div>
        )}
      </div>
      <button onClick={calculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate Tax
      </button>
    </div>
  )
}

export default function CalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<string>("compound-interest")
  const [result, setResult] = useState<CalculatorResult | null>(null)

  const user = auth.currentUser

  if (!user) {
    return (
      <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="rounded-lg border border-muted p-6 surface-card max-w-md w-full">
          <h1 className="text-2xl font-semibold">Please log in</h1>
          <p className="mt-2 text-muted-foreground">You need an account to access the finance calculators.</p>
          <div className="mt-4">
            <Link href="/login" className="btn-brand-outline hover-glow-blue">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const activeCalc = calculators.find((c) => c.id === activeCalculator)!

  const renderCalculator = () => {
    switch (activeCalculator) {
      case "compound-interest":
        return <CompoundInterestCalculator onResult={setResult} />
      case "sip":
        return <SIPCalculator onResult={setResult} />
      case "loan-emi":
        return <LoanEMICalculator onResult={setResult} />
      case "fd-calculator":
        return <FDCalculator onResult={setResult} />
      case "retirement":
        return <RetirementCalculator onResult={setResult} />
      case "tax-calculator":
        return <TaxCalculator onResult={setResult} />
      default:
        return null
    }
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--brand)]/20">
              <Calculator className="h-8 w-8 text-[var(--brand)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold">Finance Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-2">Calculate everything from EMIs to retirement planning</p>
          <p className="text-sm text-muted-foreground">
            Professional-grade financial calculators for smart money decisions
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Calculator Menu */}
          <aside className="space-y-2">
            <h2 className="font-medium mb-4">Choose Calculator</h2>
            {calculators.map((calc) => {
              const Icon = calc.icon
              return (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalculator(calc.id)
                    setResult(null)
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left",
                    activeCalculator === calc.id
                      ? "bg-[var(--brand)]/20 border-[var(--brand)] text-[var(--brand)]"
                      : "border-[var(--color-border)] hover:bg-background/60",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">{calc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{calc.description}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-background/60 mt-2 inline-block">
                      {calc.category}
                    </span>
                  </div>
                </button>
              )
            })}
          </aside>

          {/* Calculator Content */}
          <div className="space-y-6">
            {/* Calculator Header */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[var(--brand)]/20">
                  <activeCalc.icon className="h-6 w-6 text-[var(--brand)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{activeCalc.title}</h2>
                  <p className="text-muted-foreground">{activeCalc.description}</p>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <h3 className="font-medium mb-4">Enter Details</h3>
              {renderCalculator()}
            </div>

            {/* Results */}
            {result && (
              <div className="rounded-lg border border-muted p-6 surface-card">
                <h3 className="font-medium mb-4">{result.title}</h3>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-[var(--brand)] mb-2">{result.value}</div>
                  <p className="text-sm text-muted-foreground">
                    {activeCalculator === "loan-emi"
                      ? "Monthly EMI"
                      : activeCalculator === "retirement"
                        ? "Monthly Investment Required"
                        : activeCalculator === "tax-calculator"
                          ? "Total Tax Liability"
                          : "Final Amount"}
                  </p>
                </div>

                {result.details && (
                  <div className="grid gap-2 md:grid-cols-2">
                    {result.details.map((detail, index) => (
                      <div key={index} className="flex justify-between p-3 rounded-md bg-background/40">
                        <span className="text-sm text-muted-foreground">{detail.split(":")[0]}:</span>
                        <span className="text-sm font-medium">{detail.split(":")[1]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Need more financial tools?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fun-learn" className="btn-brand-outline hover-glow-green text-sm">
              Interactive Learning
            </Link>
            <Link href="/learn" className="btn-brand-outline hover-glow-white text-sm">
              Learning Hub
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
