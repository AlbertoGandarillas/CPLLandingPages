import { useQuery } from "@tanstack/react-query";
import { ViewCPLExhibitCourses } from "@prisma/client";

export function useExhibitArticulatedCourses(exhibitId: string | null) {
  return useQuery<ViewCPLExhibitCourses[], Error>({
    queryKey: ["exhibitArticulatedCourses", exhibitId],
    queryFn: async () => {
      const url = exhibitId
        ? `/api/exhibit-articulated-courses/${exhibitId}`
        : "/api/exhibit-articulated-courses";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
