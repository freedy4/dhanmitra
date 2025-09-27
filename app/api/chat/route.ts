import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "groq/llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful financial advisor AI assistant. You specialize in:
        - Banking and savings advice
        - Investment strategies and portfolio management
        - Insurance planning and coverage recommendations
        - Tax planning and optimization
        - Personal finance management
        - Financial goal setting and planning
        
        Always provide practical, actionable advice. Use simple language and explain complex financial concepts clearly. 
        When discussing specific financial products or strategies, remind users to consult with qualified financial advisors for personalized advice.
        Focus on Indian financial context when relevant (INR, Indian tax laws, etc.).`,
      },
      ...prompt,
    ],
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
