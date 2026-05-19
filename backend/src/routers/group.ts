import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../../trpc.js"
import { prisma } from "../../prisma.js"

export const groupRouter = router({
   create: publicProcedure
      .input(z.object({name: z.string(), userID: z.string()}))
      .mutation(async ({input }) =>{
         return await prisma.group.create({
            data: {name: input.name, userID: input.userID},
         });
      }),
   getByID: protectedProcedure
      .input(z.object({id: z.number()}))
      .query(async({input})=>{
         return await prisma.group.findUnique({
            where: {id: input.id}
         })
      })
});