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
import {
  useBookShelfs,
  useCreateBookShelf,
  useDeleteBookShelf,
  useUpdateBookShelf,
} from "../queries/bookshelf";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Label } from "@radix-ui/react-label";

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

  const createBookshelfMutation = useCreateBookShelf();
  const allBookshelf = useBookShelfs();
  const deleteBookshelf = useDeleteBookShelf();
  const updateBookshelf = useUpdateBookShelf();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createBookshelfMutation.mutate(values);
    form.resetField("name");
  }

  const handleDeleteShelf = async (shelfId: string) => {
    deleteBookshelf.mutate({ bookShelfId: shelfId });
  };

  const handleUpdateShelf = async (shelfId: string, name: string) => {
    updateBookshelf.mutate({ bookShelfId: shelfId, name: name });
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      {createBookshelfMutation.isPending ||
        deleteBookshelf.isIdle ||
        (allBookshelf.isLoading && <Spinner />)}
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
                <FormLabel>Bookshelf Name</FormLabel>
                <FormControl>
                  <Input placeholder="first_bookshelf" {...field} />
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
      <div className="col-span-3 col-end-7 p-4">
        <Table className="border-2">
          <TableCaption>A list of your all bookshelf.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Book Shelf Name</TableHead>
              <TableHead className="w-[200px]">Created At</TableHead>
              <TableHead className="w-[200px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allBookshelf.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
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
                            Edit Bookshelf
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Update the bookshelf details below.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              defaultValue={row.name}
                              className="col-span-2 h-8"
                              onChange={(e) => (row.name = e.target.value)} // Değeri geçici olarak tut
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => handleUpdateShelf(row.id, row.name)}
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
                    onClick={() => handleDeleteShelf(row.id)}
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
