"use client";

import React from "react";
import {
  useAuthors,
  useCreateAuthor,
  useDeleteAuthor,
  useUpdateAuthor,
} from "../queries/author";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 1 characters.",
  }),
});

export default function AuthorPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const author = useAuthors();
  const createAuthorMutation = useCreateAuthor();
  const updateAuthorMutation = useUpdateAuthor();
  const deleteAuthorMutation = useDeleteAuthor();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createAuthorMutation.mutate(values);
    form.resetField("name");
  }

  const handleUpdateAuthor = (id: string, name: string) => {
    updateAuthorMutation.mutate({ authorId: id, name: name });
  };

  const handleDeleteAuthor = (id : string) => {
    deleteAuthorMutation.mutate({authorId : id})
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-start-1 col-end-3 space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="author name" {...field} />
                </FormControl>
                <FormDescription>This is your authors name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
      <div className="col-span-3 col-end-7 p-4">
        <Table className="border-2">
          <TableCaption>A list of your all author.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Author Name</TableHead>
              <TableHead className="w-[200px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {author.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Pencil
                        size={18}
                        className="cursor-pointer text-green-400"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="z-50 w-80 rounded-lg bg-white p-4 shadow-lg">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Edit Author Name
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Update the author details below.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              defaultValue={row.name}
                              className="col-span-2 h-8"
                              onChange={(e) => (row.name = e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                           onClick={() => handleUpdateAuthor(row.id, row.name)}
                          className="w-full"
                        >
                          Save
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-400"
                    onClick={() => handleDeleteAuthor(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
