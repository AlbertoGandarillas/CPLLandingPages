import React, { useState } from "react";
import * as XLSX from "xlsx";
import { ArticulationExport } from "@/types/ArticulationsExportXLS";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "./ArticulationHeader";
import ArticulationList from "./ArticulationList";
import { ViewCPLArticulations } from "@prisma/client";
import { exportToExcel } from "@/lib/events/exportUtils";

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

  const handleExport = () => {
    if (articulations.length > 0) {
      exportToExcel(articulations, "Articulations");
    }
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
          showExport={false}
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
