import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAppointment = (appointmentId: string) => {
  const query = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      const response = await client.api.appointment.patient[":id"].$get({
        param: { id: appointmentId },
      });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
