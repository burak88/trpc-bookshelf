import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const bookshelfRouter = createTRPCRouter({
  // get bookshelfs by user id
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const bookshelfs = await ctx.db.bookshelf.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (bookshelfs.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No bookshelves found for the current user.",
      });
    }
    return bookshelfs;
  }),

  // get bookshelfs by name
  getByName: protectedProcedure
    .input(z.object({ name: z.string({ required_error: "Name is required" }) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBookshelf = await ctx.db.bookshelf.findFirst({
        where: {
          name: input.name,
          userId: userId,
        },
      });
      if (!existingBookshelf) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No bookshelves found for the current user and name",
        });
      }

      return existingBookshelf;
    }),

  // create bookshelf
  create: protectedProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.bookshelf.create({
        data: {
          name: input.name,
          userId: userId,
        },
      });
    }),

  //delete bookshelf
  delete: protectedProcedure
    .input(
      z.object({
        bookShelfId: z.string({ required_error: "Please select bookshelf" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBookshelf = await ctx.db.bookshelf.findFirst({
        where: {
          id: input.bookShelfId,
          userId: userId,
        },
      });
      if (!existingBookshelf) {
        throw new Error(
          "Bookshelf not found or you do not have permission to delete it.",
        );
      }
      return ctx.db.bookshelf.delete({
        where: {
          id: input.bookShelfId,
        },
      });
    }),

  // update bookshelf
  update: protectedProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
        bookShelfId: z.string({ required_error: "Please select bookshelf" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBookshelf = await ctx.db.bookshelf.findFirst({
        where: {
          id: input.bookShelfId,
          userId: userId,
        },
      });

      if (!existingBookshelf) {
        throw new Error(
          "Bookshelf not found or you do not have permission to update it.",
        );
      }

      return ctx.db.bookshelf.update({
        where: {
          id: input.bookShelfId,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
