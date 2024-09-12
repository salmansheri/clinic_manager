import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.appointment.doctor.approved.status)[":id"]["$post"]
>["param"];

type ResponseType = InferResponseType<
  (typeof client.api.appointment.doctor.approved.status)[":id"]["$post"]
>;

export const useDoctorApproved = () => {
  const query = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const response = await client.api.appointment.doctor.approved.status[
        ":id"
      ].$post({ param });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const data = await response.json();

      return data;
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["todaysAppointments"] });
      toast.success("Appointment Approved!");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
