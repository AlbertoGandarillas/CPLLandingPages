import { useQuery } from "@tanstack/react-query";
import { GetCPLMostCommonCRs } from "@prisma/client";

export function useMostCommonCRs(catalogYearId?: string | null) {
  return useQuery<GetCPLMostCommonCRs[], Error>({
    queryKey: ["MostCommonCRs", catalogYearId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (catalogYearId) {
        params.append("catalogYearId", catalogYearId);
      }
      const url = `/api/most-common-crs${
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
