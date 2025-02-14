import { useQuery } from "@tanstack/react-query";
import { GetCPLMostCommonCIDs } from "@prisma/client";

export function useMostCommonCIDs(catalogYearId?: string | null) {
  return useQuery<GetCPLMostCommonCIDs[], Error>({
    queryKey: ["MostCommonCIDs", catalogYearId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (catalogYearId) {
        params.append("catalogYearId", catalogYearId);
      }
      const url = `/api/most-common-cids${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
