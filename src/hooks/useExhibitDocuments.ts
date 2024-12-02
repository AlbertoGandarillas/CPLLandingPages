import { useQuery } from "@tanstack/react-query";
import { CPLExhibitDocuments } from "@prisma/client";

export function useExhibitDocuments(exhibitId: string | null) {
  return useQuery<CPLExhibitDocuments[], Error>({
    queryKey: ["exhibitDocuments", exhibitId],
    queryFn: async () => {
      const url = exhibitId
        ? `/api/exhibit-documents/${exhibitId}`
        : "/api/exhibit-documents";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
