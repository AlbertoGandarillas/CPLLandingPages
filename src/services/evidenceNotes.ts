import { ViewCPLEvidenceCompetencyNotes } from "@prisma/client";

export const evidenceNotesApi = {
    getByTitle: async (outline_id: number, title: string, type: string): Promise<ViewCPLEvidenceCompetencyNotes[]> => {
    try {
      const response = await fetch(
        `/api/cpl-evidence-notes?outline_id=${outline_id}&title=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch evidence notes");
      }

      return response.json();
    } catch (error) {
      console.error("Error in getByTitle:", error);
      throw error;
    }
  },
};
