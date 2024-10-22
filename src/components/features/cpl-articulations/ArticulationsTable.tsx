import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { ArticulationExport } from "@/types/ArticulationsExportXLS";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "../cpl-courses/ArticulationsHeader";
import ArticulationList from "./ArticulationList";
import { ViewCPLArticulations } from "@prisma/client";

interface ArticulationsTableProps {
  articulations: ViewCPLArticulations[];
  loading: boolean;
  error?: Error | null;
  searchTerm: string;
  children?: React.ReactNode;
  CollegeID: number;
}
export default function ArticulationsTable({
  articulations,
  loading,
  error,
  searchTerm,
  children,
  CollegeID,
}: ArticulationsTableProps) {
  const [selectedArticulation, setSelectedArticulation] =
    useState<ViewCPLArticulations | null>(null);
  const [viewMode, setViewMode] = React.useState("list");

  const filteredItems = useMemo(() => {
    if (searchTerm.length < 3) return articulations;

    return articulations.filter((articulation) => {
      const searchContent = `
        ${articulation.Subject ?? ""}
        ${articulation.College ?? ""}
        ${articulation.CourseNumber ?? ""}
        ${articulation.CourseTitle ?? ""}
        ${articulation.CPLTypeDescription ?? ""}
        ${articulation.CPLModeofLearningDescription ?? ""}
      `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [articulations, searchTerm]);

  const isEmpty = filteredItems.length === 0 && !loading && !error;

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={() => exportToExcel(filteredItems, "Articulations")}
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
            <ArticulationList articulations={filteredItems} />
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
        Subject: articulation.Subject ?? "",
        "Course Number": articulation.CourseNumber ?? "",
        "Course Title": articulation.CourseTitle ?? "",
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Articulations Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
