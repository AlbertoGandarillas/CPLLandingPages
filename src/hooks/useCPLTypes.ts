import { useQuery } from "@tanstack/react-query";
import { CPLType } from "@prisma/client";

export function useCPLTypes() {
  return useQuery<CPLType[], Error>({
    queryKey: ["cplTypes"],
    queryFn: async () => {
      const url = "/api/cpl-types";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
