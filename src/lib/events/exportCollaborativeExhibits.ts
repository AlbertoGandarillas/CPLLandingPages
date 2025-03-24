import * as XLSX from "xlsx";

interface FlattenedExhibit {
  AceID: string;
  Title: string;
  ExhibitCollege: string;
  VersionNumber: string;
  CreditRecommendation: string;
  ArticulationStatus: string;
  ArticulationCollege: string;
  Course: string;
  CollaborativeType: string;
}

export const exportCollaborativeExhibits = async (
  ccc: string,
  status: string | null,
  searchTerm: string | null,
  collegeID: number | undefined
) => {
  try {
    // Fetch all data without pagination
    const params = new URLSearchParams();
    if (ccc) params.append("ccc", ccc);
    if (status) params.append("status", status);
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (collegeID) params.append("collegeID", collegeID.toString());
    params.append("export", "true"); // Add this flag to fetch all records

    const response = await fetch(
      `/api/collaborative-exhibits?${params.toString()}`
    );
    if (!response.ok) throw new Error("Failed to fetch data for export");

    const data = await response.json();

    // Flatten the data structure
    const flattenedData: FlattenedExhibit[] = data.flatMap((exhibit: any) => {
      if (!exhibit.articulations || exhibit.articulations.length === 0) {
        // Return exhibit with empty articulation fields
        return [
          {
            "Exhibit ID": exhibit.AceID || "",
            Title: exhibit.Title || "",
            "Exhibit College": exhibit.college || "",
            Version: exhibit.VersionNumber || "",
            "Credit Recommendation": "",
            Status: "",
            "Articulation College": "",
            Course: "",
            "Collaborative Type": (exhibit.CollaborativeType || "").split("|").join(","),
          },
        ];
      }

      // Return exhibit with each articulation as a separate row
      return exhibit.articulations.map((articulation: any) => ({
        "Exhibit ID": exhibit.AceID || "",
        Title: exhibit.Title || "",
        "Exhibit College": exhibit.college || "",
        Version: exhibit.VersionNumber || "",
        "Credit Recommendation": articulation.CreditRecommendation || "",
        Status: articulation.Status || "",
        "Articulation College": articulation.college || "",
        Course: articulation.Course || "",
        "Collaborative Type": (exhibit.CollaborativeType || "").split("|").join(","),
      }));
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // AceID
      { wch: 40 }, // Title
      { wch: 20 }, // ExhibitCollege
      { wch: 15 }, // VersionNumber
      { wch: 30 }, // CreditRecommendation
      { wch: 15 }, // ArticulationStatus
      { wch: 20 }, // ArticulationCollege
      { wch: 30 }, // Course
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collaborative Exhibits");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `collaborative_exhibits_${date}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
