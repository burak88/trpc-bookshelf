import { api } from "@/trpc/react";

export const useBookShelfs = (name: string) => {
  const response = api.author.getByName.useQuery({ name: name });
  return response;
};

