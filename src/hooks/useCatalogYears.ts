import { useQuery } from "@tanstack/react-query";
import { LookupCatalogYear } from "@prisma/client";

export function useCatalogYears() {
  return useQuery<LookupCatalogYear[], Error>({
    queryKey: ["catalogYears"],
    queryFn: async () => {
      const url = "/api/catalog-year";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}
