export interface CatalogYear {
  StartDate: string;
  EndDate: string;
  // Add other properties if needed
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export class CatalogYearService {
  private static async fetchCatalogYear(
    catalogYearId: string,
    origin: string
  ): Promise<CatalogYear> {
    const response = await fetch(
      `${origin}/api/catalog-year?id=${catalogYearId}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Catalog year fetch failed:", errorText);
      throw new Error(`Failed to fetch catalog year: ${response.status}`);
    }

    const catalogYear = await response.json();
    console.log("Catalog year data:", catalogYear);

    if (!catalogYear.StartDate || !catalogYear.EndDate) {
      console.error("Invalid catalog year dates:", catalogYear);
      throw new Error("Invalid catalog year dates");
    }

    return catalogYear;
  }

  public static async getDateRange(
    catalogYearId: string | null,
    origin: string
  ): Promise<DateRange> {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (catalogYearId) {
      console.log("Fetching with catalogYearId:", catalogYearId);
      const catalogYear = await this.fetchCatalogYear(catalogYearId, origin);

      startDate = new Date(catalogYear.StartDate);
      endDate = new Date(catalogYear.EndDate);
      console.log("Date range:", { startDate, endDate });
    }

    return { startDate, endDate };
  }
}
