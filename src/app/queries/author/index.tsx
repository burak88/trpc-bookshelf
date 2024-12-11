import { api } from "@/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAuthors = () => {
  const response = api.author.getByUserId.useQuery();
  return response;
};


export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  const mutation = api.author.create.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["author", "getByUserId"], { type: "query" }],
      });
      toast.success(`Author created:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to create author., ${error.message}`);
    },
  });
  return mutation;
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  const mutation = api.author.update.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["author", "getByUserId"], { type: "query" }],
      });
      toast.success(`Author updated:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to update author., ${error.message}`);
    },
  });
  return mutation;
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  const mutation = api.author.delete.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [["author", "getByUserId"], { type: "query" }],
      });
      toast.success(`Author deleted:, ${data.name}`);
    },
    onError: (error) => {
      toast.error(`Failed to delete author., ${error.message}`);
    },
  });
  return mutation;
};