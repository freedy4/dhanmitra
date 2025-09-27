"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { Send, Bot, User, Loader2, MessageCircle, Lightbulb, TrendingUp, Calculator, Shield } from "lucide-react"

const suggestedQuestions = [
  {
    icon: TrendingUp,
    question: "How should I start investing with ₹10,000?",
    category: "Investment",
  },
  {
    icon: Calculator,
    question: "What's the difference between term and whole life insurance?",
    category: "Insurance",
  },
  {
    icon: Shield,
    question: "How can I save tax under Section 80C?",
    category: "Taxation",
  },
  {
    icon: Lightbulb,
    question: "Should I choose a savings account or fixed deposit?",
    category: "Banking",
  },
]

export default function AskAIPage() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const user = auth.currentUser

  if (!user) {
    return (
      <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-6">
        <div className="rounded-lg border border-muted p-6 surface-card max-w-md w-full">
          <h1 className="text-2xl font-semibold">Please log in</h1>
          <p className="mt-2 text-muted-foreground">You need an account to access the AI financial advisor.</p>
          <div className="mt-4">
            <Link href="/login" className="btn-brand-outline hover-glow-blue">
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    sendMessage({ text: input })
    setInput("")
  }

  const handleSuggestedQuestion = (question: string) => {
    if (status === "in_progress") return
    sendMessage({ text: question })
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--brand)]/20">
              <Bot className="h-8 w-8 text-[var(--brand)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold">Ask AI Financial Advisor</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-2">Get instant answers to your financial questions</p>
          <p className="text-sm text-muted-foreground">
            Powered by AI • Specialized in Banking, Investment, Insurance & Taxation
          </p>
        </header>

        {/* Chat Container */}
        <div className="rounded-lg border border-muted surface-card overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-muted-foreground mb-6">
                  Ask me anything about personal finance, investments, insurance, or taxes
                </p>

                {/* Suggested Questions */}
                <div className="grid gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(item.question)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-background/60 transition-colors text-left"
                        disabled={status === "in_progress"}
                      >
                        <Icon className="h-5 w-5 text-[var(--brand)] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{item.question}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 rounded-lg bg-[var(--brand)]/20 flex-shrink-0">
                      <Bot className="h-5 w-5 text-[var(--brand)]" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.role === "user"
                        ? "bg-[var(--brand)] text-white"
                        : "bg-background/60 border border-[var(--color-border)]",
                    )}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return <span key={index}>{part.text}</span>
                        }
                        return null
                      })}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading indicator */}
            {status === "in_progress" && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 rounded-lg bg-[var(--brand)]/20 flex-shrink-0">
                  <Bot className="h-5 w-5 text-[var(--brand)]" />
                </div>
                <div className="bg-background/60 border border-[var(--color-border)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--color-border)] p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about investments, taxes, insurance, banking..."
                className="flex-1 rounded-md bg-background/40 ring-1 ring-[var(--color-border)] px-4 py-3 focus:outline-none focus:ring-[var(--brand)] text-sm"
                disabled={status === "in_progress"}
              />
              <button
                type="submit"
                disabled={!input.trim() || status === "in_progress"}
                className={cn(
                  "px-4 py-3 rounded-md bg-[var(--brand)] text-white transition-colors flex items-center gap-2",
                  !input.trim() || status === "in_progress"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--brand)]/90",
                )}
              >
                {status === "in_progress" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are for educational purposes. Consult qualified financial advisors for personalized advice.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Need more tools?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fun-learn" className="btn-brand-outline hover-glow-blue text-sm">
              Interactive Learning
            </Link>
            <Link href="/calculator" className="btn-brand-outline hover-glow-green text-sm">
              Finance Calculator
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
