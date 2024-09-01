import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetDoctors = () => {
  const query = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await client.api.doctor.$get();

      if (!response.ok) {
        throw new Error("Something Went Wrong!");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
