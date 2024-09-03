import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<
  typeof client.api.appointment.patient.delete.$post
>["json"];
type ResponseType = InferResponseType<
  typeof client.api.appointment.patient.delete.$post
>;

export const useBulkDelete = () => {
  const query = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // @ts-ignore
    mutationFn: async (json) => {
      const response = await client.api.appointment.patient.delete.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const { data } = await response.json();

      return data;
    },
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["patientAppointments"] });
      // @ts-ignore
      toast.success(`Successfully Delete ${data.count} Appointments`);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
