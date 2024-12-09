import { useQuery } from "@tanstack/react-query";
import { ViewCPLMostCommonCIDs } from "@prisma/client";

export function useMostCommonCIDs() {
  return useQuery<ViewCPLMostCommonCIDs[], Error>({
    queryKey: ["MostCommonCIDs"],
    queryFn: async () => {
      const url = "/api/most-common-cids";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
