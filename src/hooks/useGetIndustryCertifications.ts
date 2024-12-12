import { useQuery } from "@tanstack/react-query";
import { GetIndustryCertifications } from "@prisma/client";

export function useGetIndustryCertifications(creditRecommendation: string | null) {
  return useQuery<GetIndustryCertifications[], Error>({
    queryKey: ["getIndustryCertifications", creditRecommendation],
    queryFn: async () => {
        const url = creditRecommendation
        ? `/api/get-industry-certifications?creditRecommendation=${creditRecommendation}`
        : "/api/get-industry-certifications";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
