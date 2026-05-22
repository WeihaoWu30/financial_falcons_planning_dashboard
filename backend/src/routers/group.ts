import { z } from "zod"
import { router, publicProcedure, protectedProcedure } from "../../trpc.js"
import { prisma } from "../../prisma.js"

export const groupRouter = router({

   getByUser: protectedProcedure
      .input(z.object({userID: z.string()}))
      .query(async({input}) =>{
         return await prisma.group.findUnique({
            where: {userID: input.userID}
         })
      }),

   create: protectedProcedure
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
      }),

   addMember: protectedProcedure
      .input(z.object({name: z.string(), groupID: z.number()}))
      .mutation(async ({input}) =>{
         return await prisma.member.create({
            data: {name: input.name, groupID: input.groupID},
         });
      }),

   getMembers: protectedProcedure
      .input(z.object({id: z.number()}))
      .query(async({input})=>{
         return await prisma.group.findUnique({
            where: {id: input.id},
            select:{
               members: true
            }
         });
      })
})