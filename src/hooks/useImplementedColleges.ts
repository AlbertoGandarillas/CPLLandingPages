import { useQuery } from "@tanstack/react-query";
import { ViewCPLImplementedColleges } from "@prisma/client";

export function useImplementedColleges() {
  return useQuery<ViewCPLImplementedColleges[], Error>({
    queryKey: ["implementedColleges"],
    queryFn: async () => {
      const url = "/api/implemented-colleges";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000
  });
}
