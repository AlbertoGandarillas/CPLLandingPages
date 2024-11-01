import { useQuery } from "@tanstack/react-query";
import { LookupColleges } from "@prisma/client";

export function useColleges() {
  return useQuery<LookupColleges[], Error>({
    queryKey: ["colleges"],
    queryFn: async () => {
      const url = "/api/colleges";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
