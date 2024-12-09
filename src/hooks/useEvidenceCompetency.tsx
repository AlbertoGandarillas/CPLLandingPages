"use client";
import { useQuery } from "@tanstack/react-query";

interface CompetencyType {
  ID: number;
  EvidenCompetency: string;
  Description: string;
}

interface EvidenceCompetency {
  ID: number;
  ExhibitID: number;
  ExhibitEvidenceID: number;
  CollegeID: number;
  Notes: string | null;
  EvidenceType: number | null;
  ActiveCurrent: boolean | null;
  CompetencyType: CompetencyType | null;
}

export function useEvidenceCompetency(exhibitId: string) {
  return useQuery({
    queryKey: ["evidenceCompetency", exhibitId],
    queryFn: async () => {
      const response = await fetch(`/api/evidence-competencies/${exhibitId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch evidence competency");
      }
      return response.json() as Promise<EvidenceCompetency[]>;
    },
  });
}
