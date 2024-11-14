import { useQuery } from "@tanstack/react-query";
import { ViewCPLMos } from "@prisma/client";

export function useCPLMos() {
  return useQuery<ViewCPLMos[], Error>({
    queryKey: ["cplMos"],
    queryFn: async () => {
      const url = "/api/cpl-mos";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
