"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { Calculator, TrendingUp, Shield, FileText, ChevronRight, Play, Award } from "lucide-react"

interface DemoCalculatorProps {
  type: "banking" | "investing" | "insurance" | "taxation"
}

function DemoCalculator({ type }: DemoCalculatorProps) {
  const [inputs, setInputs] = useState<Record<string, number>>({})
  const [result, setResult] = useState<string | null>(null)

  const handleCalculate = () => {
    switch (type) {
      case "banking":
        const principal = inputs.principal || 10000
        const rate = inputs.rate || 5
        const time = inputs.time || 2
        const savingsInterest = (principal * rate * time) / 100
        const fdInterest = (principal * (rate + 1) * time) / 100
        setResult(`Savings: ₹${savingsInterest.toLocaleString()} | Fixed Deposit: ₹${fdInterest.toLocaleString()}`)
        break
      case "investing":
        const investment = inputs.investment || 50000
        const stockReturn = investment * 0.12 // 12% return
        const bondReturn = investment * 0.06 // 6% return
        setResult(
          `Stocks (High Risk): ₹${stockReturn.toLocaleString()} | Bonds (Low Risk): ₹${bondReturn.toLocaleString()}`,
        )
        break
      case "insurance":
        const age = inputs.age || 30
        const coverage = inputs.coverage || 500000
        const basePremium = coverage * 0.002
        const ageFactor = age > 40 ? 1.5 : age > 30 ? 1.2 : 1
        const premium = basePremium * ageFactor
        setResult(`Annual Premium: ₹${premium.toLocaleString()}`)
        break
      case "taxation":
        const income = inputs.income || 800000
        let tax = 0
        if (income > 1000000) tax = (income - 1000000) * 0.3 + 112500
        else if (income > 500000) tax = (income - 500000) * 0.2 + 12500
        else if (income > 250000) tax = (income - 250000) * 0.05
        setResult(`Estimated Tax: ₹${tax.toLocaleString()}`)
        break
    }
  }

  const getInputFields = () => {
    switch (type) {
      case "banking":
        return (
          <>
            <input
              type="number"
              placeholder="Principal Amount (₹)"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setInputs({ ...inputs, principal: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setInputs({ ...inputs, rate: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Time Period (years)"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setInputs({ ...inputs, time: Number(e.target.value) })}
            />
          </>
        )
      case "investing":
        return (
          <input
            type="number"
            placeholder="Investment Amount (₹)"
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
            onChange={(e) => setInputs({ ...inputs, investment: Number(e.target.value) })}
          />
        )
      case "insurance":
        return (
          <>
            <input
              type="number"
              placeholder="Your Age"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Coverage Amount (₹)"
              className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
              onChange={(e) => setInputs({ ...inputs, coverage: Number(e.target.value) })}
            />
          </>
        )
      case "taxation":
        return (
          <input
            type="number"
            placeholder="Annual Income (₹)"
            className="w-full rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-3 py-2 focus:outline-none focus:ring-[var(--brand)]"
            onChange={(e) => setInputs({ ...inputs, income: Number(e.target.value) })}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {getInputFields()}
      <button onClick={handleCalculate} className="btn-brand-outline hover-glow-blue w-full">
        Calculate
      </button>
      {result && (
        <div className="p-3 rounded-md bg-[var(--brand)]/10 border border-[var(--brand)]/20">
          <p className="text-sm font-medium">{result}</p>
        </div>
      )}
    </div>
  )
}

interface QuizProps {
  topic: string
  questions: Array<{
    question: string
    options: string[]
    correct: number
  }>
}

function Quiz({ topic, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    if (answered) return
    setSelectedAnswer(answerIndex)
    setAnswered(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setAnswered(false)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnswered(false)
  }

  if (showResult) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Award className="h-6 w-6 text-[var(--brand)]" />
          <h3 className="text-lg font-medium">Quiz Complete!</h3>
        </div>
        <p className="text-muted-foreground">
          You scored {score} out of {questions.length}
        </p>
        <button onClick={resetQuiz} className="btn-brand-outline hover-glow-green">
          Try Again
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <h3 className="font-medium">{question.question}</h3>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            className={cn(
              "w-full text-left p-3 rounded-md border transition-colors",
              "hover:bg-background/60",
              answered && index === question.correct && "bg-green-500/20 border-green-500/40",
              answered && index === selectedAnswer && index !== question.correct && "bg-red-500/20 border-red-500/40",
              !answered && "border-[var(--color-border)]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

const topics = [
  {
    id: "banking",
    title: "Banking",
    icon: Calculator,
    description: "Learn about savings accounts, fixed deposits, and how banks work to grow your money safely.",
    features: [
      "Understanding different account types",
      "Interest calculations and compound growth",
      "Digital banking and security",
      "Loan basics and credit scores",
    ],
    scenario: "Rahul wants to save ₹10,000. Should he choose a savings account or fixed deposit?",
    quiz: [
      {
        question: "What is the main difference between a savings account and a fixed deposit?",
        options: [
          "Savings accounts have higher interest rates",
          "Fixed deposits lock your money for a specific period",
          "Savings accounts require minimum balance",
          "Fixed deposits have no interest",
        ],
        correct: 1,
      },
      {
        question: "What does compound interest mean?",
        options: [
          "Interest calculated only on principal",
          "Interest calculated on principal + previous interest",
          "Interest that decreases over time",
          "Interest paid monthly",
        ],
        correct: 1,
      },
      {
        question: "Which account is most suitable for daily transactions?",
        options: ["Savings account", "Checking account", "Certificate of Deposit", "Retirement account"],
        correct: 1,
      },
      {
        question: "Overdraft fees are most closely tied to:",
        options: [
          "ATM withdrawals",
          "Debit card purchases and insufficient funds",
          "Wire transfers",
          "Credit card rewards",
        ],
        correct: 1,
      },
      {
        question: "FDIC insurance typically covers deposits up to:",
        options: ["$10,000", "$50,000", "$250,000", "$1,000,000"],
        correct: 2,
      },
      {
        question: "What is the main purpose of a savings account?",
        options: ["Store money and earn interest", "Daily spending and bill pay", "Borrow money", "Invest in stocks"],
        correct: 0,
      },
      {
        question: "How can you best avoid ATM fees?",
        options: [
          "Use bank-owned or in-network ATMs",
          "Use any ATM that is closest",
          "Opt into overdraft protection",
          "Write a check instead",
        ],
        correct: 0,
      },
      {
        question: "Which should you keep secret to protect your debit card?",
        options: ["Your PIN", "Your card color", "Your bank branch", "Your mailing ZIP code"],
        correct: 0,
      },
      {
        question: "Which action is most likely to incur a foreign transaction fee?",
        options: [
          "Depositing cash at your bank",
          "Using your debit card abroad for purchases",
          "Receiving your paycheck by direct deposit",
          "Transferring between your own accounts at the same bank",
        ],
        correct: 1,
      },
      {
        question: "What is one common way to avoid monthly maintenance fees on checking accounts?",
        options: [
          "Make at least one ATM withdrawal per day",
          "Set up a qualifying direct deposit",
          "Keep your balance at exactly $0",
          "Use only paper checks",
        ],
        correct: 1,
      },
      {
        question: "If your debit card is lost or stolen, what should you do first?",
        options: [
          "Wait a week to see if it turns up",
          "Post about it on social media",
          "Report it to your bank immediately",
          "Share your PIN with a friend for help",
        ],
        correct: 2,
      },
      {
        question: "What does a bank routing number identify?",
        options: ["Your account password", "Your bank/financial institution", "Your card’s CVV code", "Your tax ID"],
        correct: 1,
      },
    ],
  },
  {
    id: "investing",
    title: "Investing",
    icon: TrendingUp,
    description: "Discover how to make your money work for you through stocks, bonds, and mutual funds.",
    features: [
      "Risk vs Return fundamentals",
      "Stock market basics",
      "Mutual funds and SIPs",
      "Portfolio diversification",
    ],
    scenario: "Priya has ₹50,000 to invest. Should she choose stocks for higher returns or bonds for safety?",
    quiz: [
      {
        question: "What is the relationship between risk and return in investing?",
        options: [
          "Higher risk always means higher returns",
          "Lower risk always means higher returns",
          "Higher risk potentially means higher returns",
          "Risk and return are unrelated",
        ],
        correct: 2,
      },
      {
        question: "What is diversification in investing?",
        options: [
          "Investing all money in one stock",
          "Spreading investments across different assets",
          "Only investing in government bonds",
          "Keeping all money in savings account",
        ],
        correct: 1,
      },
      {
        question: "Diversification primarily helps reduce:",
        options: ["Taxes", "Inflation", "Risk from any single asset", "Account fees"],
        correct: 2,
      },
      {
        question: "An ETF is best described as:",
        options: ["A single company stock", "A pooled investment tracking an index", "A savings account", "A bond"],
        correct: 1,
      },
      {
        question: "Higher expected returns generally come with:",
        options: ["Lower risk", "No risk", "Higher risk", "Guaranteed outcomes"],
        correct: 2,
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    icon: Shield,
    description: "Protect yourself and your family from unexpected financial risks with the right insurance coverage.",
    features: [
      "Types of insurance coverage",
      "Premium calculations",
      "Claim process understanding",
      "Term vs whole life insurance",
    ],
    scenario: "Amit, 30 years old, wants health insurance with ₹5 lakh coverage. How much premium should he expect?",
    quiz: [
      {
        question: "What factors affect your insurance premium?",
        options: [
          "Only your age",
          "Only the coverage amount",
          "Age, coverage amount, and health condition",
          "Only your income",
        ],
        correct: 2,
      },
      {
        question: "What is the main purpose of insurance?",
        options: [
          "To make money from investments",
          "To protect against financial losses",
          "To save taxes",
          "To get loans easily",
        ],
        correct: 1,
      },
      {
        question: "A deductible is:",
        options: [
          "The amount an insurer pays you yearly",
          "The amount you pay before insurance coverage begins",
          "A monthly premium",
          "An optional rider",
        ],
        correct: 1,
      },
      {
        question: "Liability coverage primarily protects you from:",
        options: ["Theft losses", "Market fluctuations", "Claims when you are at fault", "Maintenance costs"],
        correct: 2,
      },
      {
        question: "Copay refers to:",
        options: ["Annual fee", "Fixed amount paid at service", "Tax credit", "Rebate"],
        correct: 1,
      },
    ],
  },
  {
    id: "taxation",
    title: "Taxation",
    icon: FileText,
    description: "Understand how taxes work, deductions available, and how to file your income tax returns properly.",
    features: [
      "Income tax slabs and calculations",
      "Available deductions under 80C, 80D",
      "ITR filing process",
      "Tax planning strategies",
    ],
    scenario: "Sneha earns ₹8 lakh annually. How much income tax will she need to pay under the new tax regime?",
    quiz: [
      {
        question: "Under the new tax regime, what is the tax rate for income between ₹5-10 lakhs?",
        options: ["10%", "15%", "20%", "30%"],
        correct: 2,
      },
      {
        question: "What is Section 80C in income tax?",
        options: [
          "Tax on capital gains",
          "Deduction for investments up to ₹1.5 lakhs",
          "Tax on salary income",
          "Penalty for late filing",
        ],
        correct: 1,
      },
      {
        question: "A tax credit generally:",
        options: [
          "Reduces your taxable income dollar-for-dollar",
          "Reduces your tax bill dollar-for-dollar",
          "Increases your refund automatically",
          "Is the same as a deduction",
        ],
        correct: 1,
      },
      {
        question: "Standard vs. itemized deductions — you usually choose:",
        options: [
          "Whichever yields the higher taxable income",
          "Whichever yields the lower tax",
          "Always itemized",
          "Always standard",
        ],
        correct: 1,
      },
      {
        question: "Which is a common filing status?",
        options: ["Employee", "Head of Household", "Manager", "Employer"],
        correct: 1,
      },
    ],
  },
]

export default function FunLearnPage() {
  const [activeTab, setActiveTab] = useState("banking")
  const [showDemo, setShowDemo] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState<string | null>(null)

  const user = auth.currentUser

  if (!user) {
    return (
      <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="rounded-lg border border-muted p-6 surface-card max-w-md w-full">
          <h1 className="text-2xl font-semibold">Please log in</h1>
          <p className="mt-2 text-muted-foreground">You need an account to access the interactive learning demos.</p>
          <div className="mt-4">
            <Link href="/login" className="btn-brand-outline hover-glow-blue">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const activeTopic = topics.find((t) => t.id === activeTab)!

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">Learn Banking, Investing, Insurance & Taxation</h1>
          <p className="text-lg text-muted-foreground mb-2">Interactive Demo Page</p>
          <p className="text-sm text-muted-foreground">
            Explore financial concepts through interactive demos, calculators, and quizzes
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setActiveTab(topic.id)
                  setShowDemo(null)
                  setShowQuiz(null)
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  activeTab === topic.id
                    ? "bg-[var(--brand)]/20 border-[var(--brand)] text-[var(--brand)]"
                    : "border-[var(--color-border)] hover:bg-background/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {topic.title}
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Topic Content */}
          <div className="space-y-6">
            {/* Topic Overview */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[var(--brand)]/20">
                  <activeTopic.icon className="h-6 w-6 text-[var(--brand)]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{activeTopic.title}</h2>
                  <p className="text-muted-foreground mb-4">{activeTopic.description}</p>

                  <h3 className="font-medium mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {activeTopic.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-3 w-3 text-[var(--brand)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Case Study */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Play className="h-4 w-4 text-[var(--brand)]" />
                Real-World Scenario
              </h3>
              <p className="text-muted-foreground text-sm">{activeTopic.scenario}</p>
            </div>

            {/* Interactive Demo */}
            {showDemo === activeTab && (
              <div className="rounded-lg border border-muted p-6 surface-card">
                <h3 className="font-medium mb-4">Try the Calculator</h3>
                <DemoCalculator type={activeTab as any} />
              </div>
            )}

            {/* Quiz */}
            {showQuiz === activeTab && (
              <div className="rounded-lg border border-muted p-6 surface-card">
                <h3 className="font-medium mb-4">Test Your Knowledge</h3>
                <Quiz topic={activeTopic.title} questions={activeTopic.quiz} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowDemo(showDemo === activeTab ? null : activeTab)}
                className="btn-brand-outline hover-glow-blue"
              >
                {showDemo === activeTab ? "Hide Demo" : "Try Interactive Demo"}
              </button>
              <button
                onClick={() => setShowQuiz(showQuiz === activeTab ? null : activeTab)}
                className="btn-brand-outline hover-glow-green"
              >
                {showQuiz === activeTab ? "Hide Quiz" : "Take Quiz"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <h3 className="font-medium mb-4">Your Learning Progress</h3>
              <div className="space-y-3">
                {topics.map((topic) => {
                  const Icon = topic.icon
                  return (
                    <div key={topic.id} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{topic.title}</span>
                      <div className="w-16 h-2 bg-background/60 rounded-full">
                        <div
                          className="h-full bg-[var(--brand)] rounded-full transition-all"
                          style={{ width: topic.id === activeTab ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-lg border border-muted p-6 surface-card">
              <h3 className="font-medium mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/learn" className="block text-sm text-[var(--brand)] hover:underline">
                  → Full Learning Hub
                </Link>
                <Link href="/calculator" className="block text-sm text-[var(--brand)] hover:underline">
                  → Finance Calculator
                </Link>
              </div>
            </div>

            {/* Educational Note */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs text-muted-foreground text-center">
                This is for educational purposes only. Please consult with financial advisors for personalized advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
