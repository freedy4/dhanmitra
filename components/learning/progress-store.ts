"use client"

import { db, auth } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { TrackProgress, UserRating } from "./types"

const BASE_XP_PER_LESSON = 10
const QUIZ_PASS_BONUS = 50

export async function getUserIdOrNull() {
  const user = auth.currentUser
  return user?.uid ?? null
}

function progressDocRef(uid: string, trackId: string) {
  return doc(db, "progress", uid, "tracks", trackId)
}

export function calculateRating(quizScore?: number): UserRating | undefined {
  if (typeof quizScore !== "number") return undefined

  if (quizScore >= 80) return "Pro"
  if (quizScore >= 50) return "Learner"
  return "Starter"
}

export async function loadProgress(trackId: string): Promise<TrackProgress> {
  const uid = await getUserIdOrNull()
  if (!uid) return { completedLessonIds: [], xp: 0 }
  const ref = progressDocRef(uid, trackId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const empty: TrackProgress & { createdAt?: any } = {
      completedLessonIds: [],
      xp: 0,
      createdAt: serverTimestamp(),
    }
    await setDoc(ref, empty, { merge: true })
    return { completedLessonIds: [], xp: 0 }
  }
  const data = snap.data() as TrackProgress
  return {
    completedLessonIds: data.completedLessonIds ?? [],
    xp: data.xp ?? 0,
    quizScore: data.quizScore,
    rating: calculateRating(data.quizScore),
  }
}

export async function completeLesson(trackId: string, lessonId: string) {
  const uid = await getUserIdOrNull()
  if (!uid) return
  const ref = progressDocRef(uid, trackId)
  const snap = await getDoc(ref)
  const prev = (snap.exists() ? (snap.data() as TrackProgress) : { completedLessonIds: [], xp: 0 }) as TrackProgress
  if (prev.completedLessonIds?.includes(lessonId)) return
  const updated: TrackProgress = {
    completedLessonIds: [...(prev.completedLessonIds ?? []), lessonId],
    xp: (prev.xp ?? 0) + BASE_XP_PER_LESSON,
    quizScore: prev.quizScore,
    rating: calculateRating(prev.quizScore),
  }
  await setDoc(ref, { ...updated, updatedAt: serverTimestamp() }, { merge: true })
}

export async function submitQuiz(trackId: string, scorePercent: number) {
  const uid = await getUserIdOrNull()
  if (!uid) return
  const ref = progressDocRef(uid, trackId)
  const snap = await getDoc(ref)
  const prev = (snap.exists() ? (snap.data() as TrackProgress) : { completedLessonIds: [], xp: 0 }) as TrackProgress

  const passed = scorePercent >= 70
  const alreadyHasScore = typeof prev.quizScore === "number"
  const bonus = passed && !alreadyHasScore ? QUIZ_PASS_BONUS : 0

  const newRating = calculateRating(scorePercent)

  const updated: TrackProgress = {
    completedLessonIds: prev.completedLessonIds ?? [],
    xp: (prev.xp ?? 0) + bonus,
    quizScore: scorePercent,
    rating: newRating,
  }
  await setDoc(ref, { ...updated, updatedAt: serverTimestamp() }, { merge: true })
}
