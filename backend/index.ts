import "dotenv/config";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router, createContext } from "./trpc.js"
import { groupRouter} from "./src/routers/group.js"

const appRouter = router({
   group: groupRouter,
});

export type AppRouter = typeof appRouter;

createHTTPServer({ router: appRouter, createContext }).listen(3001);