import { z } from "zod"
import { router, protectedProcedure } from "../../trpc"
import { prisma } from "../../prisma"

export const budgetRouter = router({

   addBudget: protectedProcedure
      .input(z.object({ groupID: z.number(), limit: z.number(), month: z.number(), year: z.number() }))
      .mutation(async ({ input }) => {
         await prisma.budget.create({
            data: {
               groupID: input.groupID,
               limit: input.limit,
               month: input.month,
               year: input.year,
            }
         });
      }),

   getBudgets: protectedProcedure
      .input(z.object({ groupID: z.number() }))
      .query(async ({ input }) => {
         return await prisma.budget.findMany({
            where: { groupID: input.groupID }
         });
      }),

   getBudgetByMonthAndYear: protectedProcedure
      .input(z.object({ groupID: z.number(), month: z.number(), year: z.number() }))
      .query(async ({ input }) => {
         return await prisma.budget.findUnique({
            where: {
               groupID_month_year: {
                  groupID: input.groupID,
                  month: input.month,
                  year: input.year,
               }
            }
         });
      }),

});