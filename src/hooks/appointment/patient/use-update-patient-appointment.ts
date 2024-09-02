import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";

type RequestType = InferRequestType<
  (typeof client.api.appointment.patient.update)[":id"]["$patch"]
>["json"];
type Responsetype = InferResponseType<
  (typeof client.api.appointment.patient.update)[":id"]["$patch"]
>;

export const useUpdatePatientAppointment = (appointmentId: string) => {
  const query = useQueryClient();
  const mutation = useMutation<Responsetype, Error, RequestType>({
    // @ts-ignore
    mutationFn: async (json) => {
      const response = await client.api.appointment.patient.update[":id"][
        "$patch"
      ]({
        json,
        param: { id: appointmentId },
      });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const { data } = await response.json();

      return data;
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["patientAppointments"] });
      toast.success("Successfully Updated!");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });

  return mutation;
};
