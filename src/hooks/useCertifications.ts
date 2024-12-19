import { useInfiniteQuery } from "@tanstack/react-query";
import { ViewCPLCertifications } from "@prisma/client";

interface CertificationResponse {
  items: (ViewCPLCertifications & {
    CollegeViews: {
      College: string;
      IndustryCertification: string;
      Slug: string | null;
      TotalUnits: number | null;
    }[];
  })[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
}

export function useCertifications(searchTerm?: string, cplType?: string, learningMode?: string) {
  return useInfiniteQuery<CertificationResponse>({
    queryKey: ["Certifications", searchTerm, cplType, learningMode],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number ?? 1;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (searchTerm && searchTerm.length >= 3) {
        params.append('searchTerm', searchTerm);
      }
      
      if (cplType && cplType !== 'all') {
        params.append('cplType', cplType);
        }
      
      if (learningMode && learningMode !== 'all') {
        params.append('learningMode', learningMode);
      }
      
      const response = await fetch(`/api/cpl-certifications?${params}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
}
