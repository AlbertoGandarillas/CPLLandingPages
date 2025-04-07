import * as XLSX from "xlsx";

interface FlattenedExhibit {
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
  collegeID: number | undefined,
  modelOfLearning?: string,
  cplType?: string,
  creditRecommendation?: string,
  industryCert?: string,
  topCode?: string,
  cidNumber?: string
) => {
  try {
    const params = new URLSearchParams();
    if (ccc) params.append("ccc", ccc);
    if (status) params.append("status", status);
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (collegeID) params.append("collegeID", collegeID.toString());
    if (modelOfLearning) params.append("modelOfLearning", modelOfLearning);
    if (cplType) params.append("cplType", cplType);
    if (creditRecommendation) params.append("creditRecommendation", creditRecommendation);
    if (industryCert) params.append("industryCert", industryCert);
    if (topCode) params.append("topCode", topCode);
    if (cidNumber) params.append("cidNumber", cidNumber);
    params.append("export", "true");

    const response = await fetch(`/api/collaborative-exhibits?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch data for export");
    }

    const exhibits = await response.json();
    
    const worksheet = XLSX.utils.json_to_sheet(exhibits);
    
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
