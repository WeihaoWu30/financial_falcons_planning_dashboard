import { router } from "./trpc"
import { groupRouter } from "./src/routers/group"
import { expenseRouter } from "./src/routers/expenses"
import { budgetRouter } from "./src/routers/budget"
import { aiRouter } from "./src/routers/ai"

export const appRouter = router({
   group: groupRouter,
   expenses: expenseRouter,
   budget: budgetRouter,
   aiRecommendation: aiRouter
});

export type AppRouter = typeof appRouter;
