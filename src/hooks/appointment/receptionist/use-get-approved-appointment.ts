import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetApprovedAppointmens = () => {
  const query = useQuery({
    queryKey: ["approvedAppointments"],
    queryFn: async () => {
      const response =
        await client.api.appointment.receptionist.approved.appointments.$get();

      if (!response.ok) {
        throw new Error("Something went while Fetching Appointment Data");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
