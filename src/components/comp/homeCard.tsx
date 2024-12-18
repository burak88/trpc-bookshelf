"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useBookShelfs, useDeleteBookShelf } from "@/app/queries/bookshelf";
import { Spinner } from "../ui/spinner";

export default  function HomeCard() {
  const allBookshelf = useBookShelfs();
  const deleteShelf = useDeleteBookShelf();
  const handleDeleteShelf = (shelfId: string) => {
    deleteShelf.mutate({ bookShelfId: shelfId });
  };

  return (
    <>
    {allBookshelf.isLoading && <Spinner/>}
      {allBookshelf.data?.map((shelf) => (
        <Card key={shelf.id}>
          <CardHeader>
            <CardTitle>Your's {shelf.name}</CardTitle>
            <CardDescription>
              This is detail card about your bookshelf
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mb-4 flex flex-col space-y-1">
              <Label>Number of book</Label>
              <Label className="font-light">185</Label>
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Number of author</Label>
              <Label className="font-light">25</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link
              href={"/book"}
              className="rounded-lg bg-black p-2 text-sm text-white"
            >
              Add Book
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button>Delete</Button>
              </PopoverTrigger>
              <PopoverContent className="z-50 w-80 rounded-lg bg-white p-4 shadow-lg">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Delete {shelf.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Are you sure to delete {shelf.name}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteShelf(shelf.id)}
                    className="w-full"
                  >
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
