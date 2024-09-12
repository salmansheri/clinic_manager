import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.doctor.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.doctor.$post>;

export const useCreateDoctor = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.doctor.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Created Successfully!");
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
      console.log(`Doctor Create Error ${error.message}`);
    },
  });

  return mutation;
};
