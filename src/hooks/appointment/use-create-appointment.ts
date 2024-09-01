import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  typeof client.api.appointment.$post
>["json"];
type ResponseType = InferResponseType<typeof client.api.appointment.$post>;

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.appointment.$post({ json });

      if (!response.ok) {
        throw new Error("Something Went Wrong!");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Successfully Created!");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
