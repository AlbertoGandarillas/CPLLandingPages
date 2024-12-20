import { useQuery } from "@tanstack/react-query";
import { PotentialCPLSavings } from "@prisma/client";

export function usePotentialSavings(cplType: string | null) {
  return useQuery<PotentialCPLSavings[], Error>({
    queryKey: ["potentialSavings", cplType],
    queryFn: async () => {
      const url = cplType
        ? `/api/potential-savings?cpltype=${cplType}`
        : "/api/potential-savings";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
