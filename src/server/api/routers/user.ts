import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hash } from "bcryptjs";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(3),
        email: z.string({ required_error: "Email is required" }).email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          email: input.email,
          password: await hash(input.password, 12),
          name: input.name,
        },
      });
    }),
});
