"use client";
import React from "react";
import { DataTable } from "./DataTable";
import { useEvidenceCompetency } from "@/hooks/useEvidenceCompetency";

interface EvidenceCompetenciesTableProps {
  exhibitId: string;
}

const columns = [
  { key: "evidenceDescription", label: "Description" },
  { key: "Notes", label: "Notes" },
  { key: "ActiveCurrent", label: "Active" },
];

export function EvidenceCompetenciesTable({ exhibitId }: EvidenceCompetenciesTableProps) {
  const { data, isLoading } = useEvidenceCompetency(exhibitId);
  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Transform the data to flatten the nested structure
  const transformedData = data?.map(item => ({
    ...item,
    evidenceCompetency: item.CompetencyType?.EvidenCompetency || '',
    evidenceDescription: item.CompetencyType?.Description || '',
    ActiveCurrent: item.ActiveCurrent ? 'Yes' : 'No',
  })) || [];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Evidence Competencies</h3>
      <DataTable 
        data={transformedData} 
        columns={columns} 
        maxHeight="300px" 
      />
    </div>
  );
}
