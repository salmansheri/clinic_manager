import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.appointment.receptionist.call)[":id"]["$post"]
>["param"];
type ResponseType = InferResponseType<
  (typeof client.api.appointment.receptionist.call)[":id"]["$post"]
>;

export const useCallToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const response = await client.api.appointment.receptionist.call[
        ":id"
      ].$post({ param });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const { token, data } = await response.json();

      return {
        token,
        data,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedAppointments"] });
      toast.success("Assign token Successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
