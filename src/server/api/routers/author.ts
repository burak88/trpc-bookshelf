import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const authorRouter = createTRPCRouter({
  // get author by name
  getByName: protectedProcedure
    .input(z.object({ name: z.string({ required_error: "Name is required" }) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingAuthor = await ctx.db.author.findFirst({
        where: {
          name: input.name,
          userId: userId,
        },
      });
      if (!existingAuthor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No author found for the current user and name",
        });
      }

      return existingAuthor;
    }),

  // get authors by userId
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const existingAuthors = await ctx.db.author.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (!existingAuthors) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No author found for the current user",
      });
    }
    return existingAuthors;
  }),

  // create author
  create: protectedProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.author.create({
        data: {
          name: input.name,
          userId: userId,
        },
      });
    }),

  //delete author
  delete: protectedProcedure
    .input(
      z.object({
        authorId: z.string({ required_error: "Please select author" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingAuthor = await ctx.db.author.findFirst({
        where: {
          id: input.authorId,
          userId: userId,
        },
      });
      if (!existingAuthor) {
        throw new Error(
          "Author not found or you do not have permission to delete it.",
        );
      }
      return ctx.db.author.delete({
        where: {
          id: input.authorId,
        },
      });
    }),

  // update author
  update: protectedProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
        authorId: z.string({ required_error: "Please select author" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingAuthor = await ctx.db.author.findFirst({
        where: {
          id: input.authorId,
          userId: userId,
        },
      });

      if (!existingAuthor) {
        throw new Error(
          "Author not found or you do not have permission to update it.",
        );
      }

      return ctx.db.author.update({
        where: {
          id: input.authorId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
