import { useQuery } from "@tanstack/react-query";
import { PotentialCPLSavings } from "@prisma/client";


export function usePotentialSavings(cplType: string | null, catalogYear?: string | null) {
  return useQuery<PotentialCPLSavings[], Error>({
    queryKey: ["potentialSavings", cplType, catalogYear],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (cplType) {
        params.append("cpltype", cplType);
      }
      if (catalogYear) {
        params.append("catalogyear", catalogYear);
      }

      const url = `/api/potential-savings${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
