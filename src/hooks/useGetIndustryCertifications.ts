import { useQuery } from "@tanstack/react-query";
import { GetIndustryCertifications } from "@prisma/client";

export function useGetIndustryCertifications(creditRecommendation: string | null, catalogYearId: string | null) {
  return useQuery<GetIndustryCertifications[], Error>({
    queryKey: ["getIndustryCertifications", creditRecommendation, catalogYearId],
    queryFn: async () => {
      let url = "/api/get-industry-certifications";
      const params = new URLSearchParams();
      
      // Always add parameters, even if null
      if (creditRecommendation) {
        params.append("creditRecommendation", creditRecommendation);
      }
      if (catalogYearId) {
        params.append("catalogYearId", catalogYearId);
      }

      url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
