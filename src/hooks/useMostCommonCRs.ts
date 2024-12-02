import { useQuery } from "@tanstack/react-query";
import { ViewCPLMostCommonCreditRecommendations } from "@prisma/client";

export function useMostCommonCRs() {
  return useQuery<ViewCPLMostCommonCreditRecommendations[], Error>({
    queryKey: ["MostCommonCreditRecommendations"],
    queryFn: async () => {
      const url = "/api/most-common-crs";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
