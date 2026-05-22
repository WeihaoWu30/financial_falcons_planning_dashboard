import { z } from "zod"
import { router, protectedProcedure } from "../../trpc.js"
import { prisma } from "../../prisma.js"

export const expenseRouter = router({

   addExpense: protectedProcedure
      .input(z.object({ title: z.string(), amount: z.number(), groupID: z.number(), month: z.number(), year: z.number(), category: z.enum(["GROCERIES", "HOUSEHOLD", "TRANSPORTATION", "UTILITIES", "FURNITURE"] as const), contributions: z.array(z.object({
         memberID: z.number(),
         amount: z.number(),
      }))}))
      .mutation(async ({ input }) => {
         const newExpense = await prisma.expense.create({
            data: { title: input.title, groupID: input.groupID, amount: input.amount, category: input.category, month: input.month, year: input.year },
         });
         await prisma.expenseContribution.createMany({
            data: input.contributions.map(c => ({
               memberId: c.memberID,
               expenseId: newExpense.id,
               amount: c.amount,
            }))
         });
      }),

   getExpenses: protectedProcedure
      .input(z.object({
         groupID: z.number(),
         category: z.enum(["GROCERIES", "HOUSEHOLD", "TRANSPORTATION", "UTILITIES", "FURNITURE"] as const),
         month: z.number(),
         year: z.number()
      }))
      .query(async ({ input }) => {
         return await prisma.expense.findMany({
            where: { groupID: input.groupID, category: input.category, month: input.month, year: input.year},
            include: { contributions: true },
         });
      }),

   getExpensesByMonthYear: protectedProcedure
      .input(z.object({
         groupID: z.number(),
         month: z.number(),
      }))
      .query(async({input}) => {
         return await prisma.expense.findMany({
            where: {groupID: input.groupID, month: input.month},
            include: { contributions: true}
         });
      })

});