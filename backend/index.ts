import "dotenv/config";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router, createContext } from "./trpc.js"
import { groupRouter} from "./src/routers/group.js"
import { expenseRouter } from "./src/routers/expenses.js";
import { budgetRouter } from "./src/routers/budget.js";

const appRouter = router({
   group: groupRouter,
   expenses: expenseRouter,
   budget: budgetRouter
});

export type AppRouter = typeof appRouter;

createHTTPServer({ router: appRouter, createContext }).listen(3001);