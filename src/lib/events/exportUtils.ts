import * as XLSX from "xlsx";
import { ViewCPLArticulations } from "@prisma/client";
import { ArticulationExport } from "@/types/ArticulationsExportXLS";

export const exportToExcel = (
  articulations: ViewCPLArticulations[],
  fileName: string
): void => {
  const ws = XLSX.utils.json_to_sheet(
    articulations.map(
      (articulation): ArticulationExport => ({
        "CPL Type": articulation.CPLTypeDescription ?? "",
        College: articulation.College ?? "",
        Subject: articulation.Subject ?? "",
        "Course Number": articulation.CourseNumber ?? "",
        "Course Title": articulation.CourseTitle ?? "",
        Credits: articulation.Units ?? "",
        "CID Number": articulation.CIDNumber ?? "",
        "CID Descriptor": articulation.CIDDescriptor ?? "",
        "Exhibit ID": articulation.AceID ?? "",
        "Exhibit Title": articulation.IndustryCertification ?? "",
        "Learning Module": articulation.CPLModeofLearningDescription ?? "",
        "Credit Recommendation": articulation.Criteria ?? "",
        "Top Code": articulation.Program_Title ?? "",
        Students: articulation.Students?.toString() ?? "",
        Units: articulation.CRUnits?.toString() ?? "",
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Articulations Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
