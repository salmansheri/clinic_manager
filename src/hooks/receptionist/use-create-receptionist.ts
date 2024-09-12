import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  typeof client.api.receptionist.$post
>["json"];
type ResponseType = InferResponseType<typeof client.api.receptionist.$post>;

export const useCreateReceptionist = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.receptionist.$post({ json });

      if (!response.ok) {
        throw new Error("Something Went Wrong!");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Created Successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error.message);
    },
  });

  return mutation;
};
