"use client"

import { useMemo, useState } from "react"
import type { QuizQuestion } from "./types"
import { submitQuiz } from "./progress-store"
import { cn } from "@/lib/utils"

export function Quiz({
  trackId,
  questions,
  onSubmitted,
}: {
  trackId: string
  questions: QuizQuestion[]
  onSubmitted?: (scorePercent: number) => void
}) {
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const total = questions.length
  const correctCount = useMemo(
    () =>
      questions.reduce((acc, q, i) => {
        const a = answers[i]
        return acc + (a === q.correctIndex ? 1 : 0)
      }, 0),
    [answers, questions],
  )

  const scorePercent = useMemo(() => Math.round((correctCount / Math.max(1, total)) * 100), [correctCount, total])

  async function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    setScore(scorePercent)
    await submitQuiz(trackId, scorePercent)
    onSubmitted?.(scorePercent)
  }

  return (
    <div className="rounded-lg border border-muted p-4 md:p-6 surface-card">
      <h3 className="text-lg font-medium">Quick Quiz</h3>
      <p className="mt-1 text-sm text-muted-foreground">Earn a bonus when you score 70% or higher.</p>

      <ol className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <li key={q.id}>
            <p className="font-medium">{q.question}</p>
            <div className="mt-2 grid gap-2">
              {q.options.map((opt, idx) => {
                const selected = answers[i] === idx
                return (
                  <label
                    key={idx}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition-colors",
                      selected ? "border-[var(--brand)]" : "border-muted",
                      "hover:border-[var(--brand)]/70",
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="accent-[var(--brand)]"
                      checked={selected}
                      onChange={() =>
                        setAnswers((a) => {
                          const next = [...a]
                          next[i] = idx
                          return next
                        })
                      }
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={handleSubmit} className="btn-brand-outline hover-glow-blue" disabled={submitted}>
          {submitted ? "Submitted" : "Submit Quiz"}
        </button>
        {score !== null ? (
          <span className="text-sm">
            Score: <span className="font-semibold">{score}%</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}
