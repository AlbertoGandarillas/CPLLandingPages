import { useQuery } from "@tanstack/react-query";
import { LookupColleges } from "@prisma/client";

export function useFindColleges(ignorePaging?: boolean) {
  return useQuery<LookupColleges[], Error>({
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
