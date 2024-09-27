import { useQuery } from "@tanstack/react-query";
import { ViewCPLCommonQualifications } from "@prisma/client";

export function useIndustryCertifications(collegeId?: string | null) {
  return useQuery<ViewCPLCommonQualifications[], Error>({
    queryKey: ["industryCertifications", collegeId],
    queryFn: async () => {
      const url = collegeId
        ? `/api/industry-certifications?collegeId=${collegeId}`
        : "/api/industry-certifications";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
