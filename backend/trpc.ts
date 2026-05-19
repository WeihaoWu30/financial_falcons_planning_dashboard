import { initTRPC, TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export const createContext = ({ req }: CreateHTTPContextOptions) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return { token };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.token) throw new TRPCError({ code: "UNAUTHORIZED" });

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.getUser(ctx.token);
  if (error || !data.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx: { ...ctx, user: data.user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);