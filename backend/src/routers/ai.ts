import { z } from "zod"
import { router, protectedProcedure } from "../../trpc"
import { prisma } from "../../prisma"
import { GoogleGenAI } from "@google/genai"


export const aiRouter = router({
   getAIRecommendation: protectedProcedure
      .input(z.object({ groupID: z.number(), month: z.number() }))
      .mutation(async ({ input }) => {
         const expenses = await prisma.expense.findMany({
            where: {
               groupID: input.groupID,
               month: input.month
            },
            include: { contributions: true }
         })

         const budget = await prisma.budget.findFirst({
            where: {
               groupID: input.groupID,
               month: input.month
            }
         })

         const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

         const byCategory = expenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] ?? 0) + e.amount
            return acc
         }, {} as Record<string, number>)

         const categoryBreakdown = Object.entries(byCategory)
            .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
            .join(', ')

         const prompt = `
         You are a financial advisor helping international students save money.
         This group spent $${totalSpent.toFixed(2)} this month.
         Breakdown by category: ${categoryBreakdown}.
         Their budget limit is $${budget?.limit ?? 'not set'}.
         Give 3 specific, actionable tips to help them save money next month. Keep it concise.`

         const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!})

         const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
         })

         return { text: response.text}
      })
});