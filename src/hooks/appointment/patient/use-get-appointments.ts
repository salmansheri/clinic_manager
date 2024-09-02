import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAppointments = () => {
  const query = useQuery({
    queryKey: ["patientAppointments"],
    queryFn: async () => {
      const response = await client.api.appointment.patient.$get();

      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
