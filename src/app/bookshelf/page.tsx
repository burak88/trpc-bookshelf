"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 1 characters.",
  }),
});

export default function BookShelfPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const createBookshelfMutation  = api.bookShelf.create.useMutation({
    onSuccess: (data ) => {
      console.log("Bookshelf created:", data);
      alert("Bookshelf created successfully!");
    },
    onError: (error) => {
      console.error("Error creating bookshelf:", error.message);
      alert("Failed to create bookshelf.");
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    createBookshelfMutation.mutate(values)
    form.resetField("name");
    console.log(values);
  }
  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bookshelf Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your private bookshelf name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
