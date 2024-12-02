import { useQuery } from "@tanstack/react-query";
import { CPLRubric } from "@prisma/client";

export function useRubricItems(exhibitId: string | null) {
  return useQuery<CPLRubric[], Error>({
    queryKey: ["rubricItems", exhibitId],
    queryFn: async () => {
      const url = exhibitId
        ? `/api/rubric-items/${exhibitId}`
        : "/api/rubric-items";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
