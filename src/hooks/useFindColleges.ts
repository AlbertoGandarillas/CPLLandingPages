import { useQuery } from "@tanstack/react-query";
import { LookupColleges, ViewCPLCertificationsByCollege } from "@prisma/client";
interface CollegesResponse {
  items: (LookupColleges & {
    CollegeUIConfig: {
      Slug: string | null;
    }[];
    CertificationsByCollege: ViewCPLCertificationsByCollege[];
  })[];
}
export function useFindColleges(ignorePaging?: boolean) {
  return useQuery<CollegesResponse, Error>({
    queryKey: ["find-colleges", ignorePaging],
    queryFn: async () => {
      const url = `/api/find-colleges${ignorePaging ? '?ignorePaging=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
