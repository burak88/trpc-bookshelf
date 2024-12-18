"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthors } from "../queries/author";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
} from "../queries/book";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimestamp } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 1 characters.",
  }),
  authorName: z.string().min(2, {
    message: "Please select a author name",
  }),
});

export default function BookPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authorName: "",
    },
  });

  const authors = useAuthors();
  const books = useBooks();
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createBookMutation.mutate(values);
    form.reset();
  }

  const handleUpdataBook = (
    bookId: string,
    title?: string,
    authorId?: string,
  ) => {
    updateBookMutation.mutate({
      bookId: bookId,
      title: title,
      authorId: authorId,
    });
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBookMutation.mutate({ bookId: bookId });
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-start-1 col-end-3 space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Book </FormLabel>
                <FormControl>
                  <Input placeholder="book name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="min-w-fit">
                      <SelectValue placeholder="Author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.data?.map((author) => (
                        <SelectItem key={author.id} value={author.name}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Choose an author for this book.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
      <div className="col-span-3 col-end-7 p-4">
        <Table className="border-2">
          <TableCaption>A list of your all book.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Book Name</TableHead>
              <TableHead className="w-[200px]">Author Name</TableHead>
              <TableHead className="w-[200px]">Created At</TableHead>
              <TableHead className="w-[200px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="font-medium">
                  {authors.data?.find((x) => x.id === row.authorId)?.name}
                </TableCell>
                <TableCell>{formatTimestamp(row.createdAt)}</TableCell>
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
                            Edit Book
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Update the book details below.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              defaultValue={row.title}
                              className="col-span-2 h-8"
                              onChange={(e) => (row.title = e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="author">Author</Label>
                            <Select
                              defaultValue={row.authorId}
                              onValueChange={(value) => (row.authorId = value)}
                            >
                              <SelectTrigger className="col-span-2">
                                <SelectValue placeholder="Author" />
                              </SelectTrigger>
                              <SelectContent>
                                {authors.data?.map((author) => (
                                  <SelectItem key={author.id} value={author.id}>
                                    {author.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            handleUpdataBook(row.id, row.title, row.authorId)
                          }
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
                    onClick={() => handleDeleteBook(row.id)}
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
