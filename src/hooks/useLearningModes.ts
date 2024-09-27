import { useQuery } from "@tanstack/react-query";
import { CPLModeofLearning } from "@prisma/client";

export function useLearningModes() {
  return useQuery<CPLModeofLearning[], Error>({
    queryKey: ["learningModes"],
    queryFn: async () => {
      const url = "/api/cpl-learning-modes";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}
