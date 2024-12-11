import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useBookShelfs = () => {
    const response = api.bookShelf.getByUserId.useQuery();
    return response;
  };
  

export const useCreateBookShelf = () => {
  const queryClient = useQueryClient();
  const mutation = api.bookShelf.create.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["bookShelf", "getByUserId"], { type: "query" }],
      });
      toast.success(`Bookshelf created:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to create bookshelf., ${error.message}`);
    },
  });
  return mutation;
};

export const useDeleteBookShelf = () => {
  const queryClient = useQueryClient();
  const mutation = api.bookShelf.delete.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["bookShelf", "getByUserId"], { type: "query" }],
      });
      toast.success(`Bookshelf deleted:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to delete bookshelf., ${error.message}`);
    },
  });
  return mutation;
};

export const useUpdateBookShelf = () => {
  const queryClient = useQueryClient();
  const mutation = api.bookShelf.update.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["bookShelf", "getByUserId"], { type: "query" }],
      });
      toast.success(`Bookshelf updated:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to update bookshelf., ${error.message}`);
    },
  });
  return mutation;
};
