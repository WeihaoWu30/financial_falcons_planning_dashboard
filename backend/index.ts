import "dotenv/config";
import { createServer } from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { router, createContext } from "./trpc.js"
import { groupRouter } from "./src/routers/group.js"
import { expenseRouter } from "./src/routers/expenses.js";
import { budgetRouter } from "./src/routers/budget.js";
import { aiRouter } from "./src/routers/ai.js";

const appRouter = router({
   group: groupRouter,
   expenses: expenseRouter,
   budget: budgetRouter,
   aiRecommendation: aiRouter
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({ router: appRouter, createContext });

createServer((req, res) => {
   res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL ?? "http://localhost:3000");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
   if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
   }
   if (req.url?.startsWith("/trpc")) {
      req.url = req.url.replace("/trpc", "");
      handler(req, res);
   } else {
      res.writeHead(404);
      res.end();
   }
}).listen(process.env.PORT ?? 4000
   
);