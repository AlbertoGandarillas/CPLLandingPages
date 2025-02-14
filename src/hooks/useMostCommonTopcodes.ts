import { useQuery } from "@tanstack/react-query";
import { GetCPLMostCommonTopCodes } from "@prisma/client";

export function useMostCommonTopcodes(catalogYearId?: string | null) {
  return useQuery<GetCPLMostCommonTopCodes[], Error>({
    queryKey: ["MostCommonTopcodes", catalogYearId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (catalogYearId) {
        params.append("catalogYearId", catalogYearId);
      }
      const url = `/api/most-common-topcodes${
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
