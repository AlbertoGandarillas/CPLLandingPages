import * as XLSX from "xlsx";

interface FlattenedExhibit {
  "Exhibit ID": string;
  Title: string;
  "Exhibit College": string;
  Version: string;
  "Credit Recommendation": string;
  Status: string;
  "Articulation College": string;
  Course: string;
  "Collaborative Types": string;
}

export const exportCollaborativeExhibits = async (
  ccc: string,
  status: string | null,
  searchTerm: string | null,
  collegeID: number | undefined
) => {
  try {
    const params = new URLSearchParams();
    if (ccc) params.append("ccc", ccc);
    if (status) params.append("status", status);
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (collegeID) params.append("collegeID", collegeID.toString());
    params.append("export", "true");

    const response = await fetch(`/api/collaborative-exhibits?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch data for export");

    const exhibits = await response.json();
    // Aplanar los datos para el Excel
    const flattenedData: FlattenedExhibit[] = exhibits.flatMap((exhibit: any) => {
      const collaborativeTypes = exhibit.collaborativeTypes
        ?.map((type: any) => type.Description)
        .join(", ") || "";

      if (!exhibit.creditRecommendations?.length) {
        return [{
          "Exhibit ID": exhibit.AceID || "",
          Title: exhibit.Title || "",
          "Exhibit College": exhibit.college || "",
          Version: exhibit.VersionNumber || "",
          "Credit Recommendation": "",
          Status: "",
          "Articulation College": "",
          Course: "",
          "Collaborative Types": collaborativeTypes
        }];
      }

      return exhibit.creditRecommendations.flatMap((cr: any) => {
        if (!cr.articulations?.length) {
          return [{
            "Exhibit ID": exhibit.AceID || "",
            Title: exhibit.Title || "",
            "Exhibit College": exhibit.college || "",
            Version: exhibit.VersionNumber || "",
            "Credit Recommendation": cr.CreditRecommendation || "",
            Status: "",
            "Articulation College": "",
            Course: "",
            "Collaborative Types": collaborativeTypes
          }];
        }

        return cr.articulations.map((articulation: any) => ({
          "Exhibit ID": exhibit.AceID || "",
          Title: exhibit.Title || "",
          "Exhibit College": exhibit.college || "",
          Version: exhibit.VersionNumber || "",
          "Credit Recommendation": cr.CreditRecommendation || "",
          Status: articulation.Status || "",
          "Articulation College": articulation.college || "",
          Course: articulation.Course || "",
          "Collaborative Types": collaborativeTypes
        }));
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    
    const columnWidths = [
      { wch: 15 }, // Exhibit ID
      { wch: 40 }, // Title
      { wch: 20 }, // Exhibit College
      { wch: 15 }, // Version
      { wch: 30 }, // Credit Recommendation
      { wch: 15 }, // Status
      { wch: 20 }, // Articulation College
      { wch: 30 }, // Course
      { wch: 30 }, // Collaborative Types
    ];
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborative Exhibits");

    const date = new Date().toISOString().split("T")[0];
    const filename = `collaborative_exhibits_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
