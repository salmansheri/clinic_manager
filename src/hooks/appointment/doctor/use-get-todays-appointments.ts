import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetTodaysAppointmens = () => {
  const query = useQuery({
    queryKey: ["todaysAppointments"],
    queryFn: async () => {
      const response = await client.api.appointment.today.$get();

      if (!response.ok) {
        throw new Error("Something went while Fetching Appointment Data");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
