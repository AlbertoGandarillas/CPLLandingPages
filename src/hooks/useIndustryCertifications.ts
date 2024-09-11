import { useQuery } from "@tanstack/react-query";
import { ViewCPLCommonQualifications } from "@prisma/client";

export function useIndustryCertifications(collegeId: string) {
  return useQuery<ViewCPLCommonQualifications[], Error>({
    queryKey: ["industryCertifications", collegeId],
    queryFn: () =>
      fetch(`/api/industry-certifications?collegeId=${collegeId}`).then(
        (res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        }
      ),
  });
}
