import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const bookRouter = createTRPCRouter({
  // get books by user id
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.db.book.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    if (books.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No books found for the current user.",
      });
    }
    return books;
  }),

  // get books by title
  getByTitle: protectedProcedure
    .input(
      z.object({ title: z.string({ required_error: "Title is required" }) }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBooks = await ctx.db.book.findFirst({
        where: {
          title: input.title,
          userId: userId,
        },
      });
      if (!existingBooks) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No books found for the current user and name",
        });
      }

      return existingBooks;
    }),

  // create books
  create: protectedProcedure
    .input(
      z.object({
        title: z.string({ required_error: "Title is required" }).min(1),
        authorName: z
          .string({ required_error: "Author name is required" })
          .min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentAuthor = await ctx.db.author.findFirst({
        where: {
          name: input.authorName,
        },
      });
      if (!currentAuthor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No author found for the given author name.",
        });
      } else {
        const userId = ctx.session.user.id;
        return ctx.db.book.create({
          data: {
            title: input.title,
            userId: userId,
            authorId: currentAuthor.id,
          },
        });
      }
    }),

  //delete book
  delete: protectedProcedure
    .input(
      z.object({
        bookId: z.string({ required_error: "Please select book" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBook = await ctx.db.book.findFirst({
        where: {
          id: input.bookId,
          userId: userId,
        },
      });
      if (!existingBook) {
        throw new Error(
          "Book not found or you do not have permission to delete it.",
        );
      }
      return ctx.db.book.delete({
        where: {
          id: input.bookId,
        },
      });
    }),

  // update book
  update: protectedProcedure
    .input(
      z
        .object({
          bookId: z.string({ required_error: "Please select book" }),
          title: z.string().optional(),
          authorId: z.string().optional(),
        })
        .refine((data) => data.title || data.authorId, {
          message:
            "You must provide at least one field to update (title or author)",
          path: ["title"],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingBook = await ctx.db.book.findFirst({
        where: {
          id: input.bookId,
          userId: userId,
        },
      });

      if (!existingBook) {
        throw new Error(
          "Book not found or you do not have permission to update it.",
        );
      }
      const updateData: { title?: string; authorId?: string } = {};
      if (input.title) updateData.title = input.title;
      if (input.authorId) updateData.authorId = input.authorId;
      return ctx.db.book.update({
        where: {
          id: input.bookId,
        },
        data: updateData,
      });
    }),
});
