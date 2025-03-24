import { LookupCatalogYear } from "@prisma/client";

export const catalogYearApi = {
  getCurrentCatalogYear: async (): Promise<LookupCatalogYear | null> => {
    try {
      const response = await fetch("/api/catalog-year/current", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch current catalog year");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching current catalog year:", error);
      throw error;
    }
  },
}; 