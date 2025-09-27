export type Lesson = {
  id: string
  title: string
  type: "text" | "video" | "pdf"
  level?: "beginner" | "intermediate" | "advanced"
  content?: string // used for text lessons
  link?: string // used for video/pdf lessons
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

export type Track = {
  id: string
  title: string
  lessons: Lesson[]
  quiz?: QuizQuestion[] // make quiz optional because quizzes moved to Fun Learn
}

export type UserRating = "Starter" | "Learner" | "Pro"

export type TrackProgress = {
  completedLessonIds: string[]
  quizScore?: number
  xp: number
  rating?: UserRating
}
