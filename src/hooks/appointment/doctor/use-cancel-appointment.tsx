import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.appointment.doctor.appointment.cancel)[":id"]["$post"]
>["param"];
type ResponseType = InferResponseType<
  (typeof client.api.appointment.doctor.appointment.cancel)[":id"]["$post"]
>;

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const response = await client.api.appointment.doctor.appointment.cancel[
        ":id"
      ].$post({
        param,
      });

      if (!response) throw new Error("Something went wrong!");

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaysAppointments"] });
      toast.success("Assign token Successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
