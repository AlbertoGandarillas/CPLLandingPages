import { useQuery } from "@tanstack/react-query";
import { ViewCPLMostCommonTopCodes } from "@prisma/client";

export function useMostCommonTopcodes() {
  return useQuery<ViewCPLMostCommonTopCodes[], Error>({
    queryKey: ["MostCommonTopcodes"],
    queryFn: async () => {
      const url = "/api/most-common-topcodes";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
