import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useBooks = () => {
  const response = api.book.getByUserId.useQuery();
  return response;
};

export const useBookByTitle = (title: string) => {
  const response = api.book.getByTitle.useQuery({ title: title });
  return response;
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const mutation = api.book.create.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["book", "getByUserId"], { type: "query" }],
      });
      toast.success(`Book created:, ${data.title}`);
    },
    onError: (error) => {
      toast.error(`Failed to create book., ${error.message}`);
    },
  });
  return mutation;
};

export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    const mutation = api.book.update.useMutation({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [["book", "getByUserId"], { type: "query" }],
        });
        toast.success(`Book updated:, ${data.title}`);
      },
      onError: (error) => {
        toast.error(`Failed to update book., ${error.message}`);
      },
    });
    return mutation;
  };
  
  export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    const mutation = api.book.delete.useMutation({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [["book", "getByUserId"], { type: "query" }],
        });
        toast.success(`Book deleted:, ${data.title}`);
      },
      onError: (error) => {
        toast.error(`Failed to delete book., ${error.message}`);
      },
    });
    return mutation;
  };