import React, { useState } from "react";
import * as XLSX from "xlsx";
import { ArticulationExport } from "@/types/ArticulationsExportXLS";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "./ArticulationHeader";
import ArticulationList from "./ArticulationList";
import { ViewCPLArticulations } from "@prisma/client";

interface ArticulationsTableProps {
  articulations?: ViewCPLArticulations[];
  loading: boolean;
  error?: Error | null;
  searchTerm: string;
  children?: React.ReactNode;
  CollegeID?: number;
}

export default function ArticulationsTable({
  articulations = [],
  loading,
  error,
  searchTerm,
  children,
  CollegeID,
}: ArticulationsTableProps) {
  const [selectedArticulation, setSelectedArticulation] =
    useState<ViewCPLArticulations | null>(null);
  const [viewMode, setViewMode] = React.useState("list");

  const isEmpty = articulations.length === 0 && !loading && !error;

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 overflow-y-auto max-h-[600px]">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={() => exportToExcel(articulations, "Articulations")}
        >
          {children}
        </ArticulationHeader>
        {error && <p>Error: {error.message}</p>}
        {isEmpty ? (
          <p className="text-center text-xl p-4 sm:p-10 w-full sm:w-1/2 m-auto">
            No results found.
          </p>
        ) : (
          <SkeletonWrapper isLoading={loading} fullWidth={true} variant="table">
            <ArticulationList articulations={articulations} />
          </SkeletonWrapper>
        )}
      </div>
    </>
  );
}

const exportToExcel = (
  articulations: ViewCPLArticulations[],
  fileName: string
): void => {
  const ws = XLSX.utils.json_to_sheet(
    articulations.map(
      (articulation): ArticulationExport => ({
        "CPL Type": articulation.CPLTypeDescription ?? "",
        "College": articulation.College ?? "",
        "Subject": articulation.Subject ?? "",
        "Course Number": articulation.CourseNumber ?? "",
        "Course Title": articulation.CourseTitle ?? "",
        "Credits": articulation.Units ?? "",
        "CID Number": articulation.CIDNumber ?? "",
        "CID Descriptor": articulation.CIDDescriptor ?? "",
        "Exhibit ID": articulation.AceID ?? "",
        "Exhibit Title": articulation.IndustryCertification ?? "",
        "Learning Module": articulation.CPLModeofLearningDescription ?? "",
        "Credit Recommendation": articulation.Criteria ?? "",
        "Top Code": articulation.Program_Title ?? "",
        "Students": articulation.Students?.toString() ?? "",
        "Units": articulation.CRUnits?.toString() ?? "",
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Articulations Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
