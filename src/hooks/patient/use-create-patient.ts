import { InferRequestType, InferResponseType } from "hono";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.patient.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.patient.$post>;

export const useCreatePatient = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.patient.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Account Created Successfully!");
      }
    },
    onError: (error) => {
      toast.error(`${error.message}`);
      console.log(error.message);
    },
  });

  return mutation;
};
