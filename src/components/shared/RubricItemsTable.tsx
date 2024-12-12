"use client";
import React from "react";
import { DataTable } from "../shared/DataTable";
import { useRubricItems } from "../../hooks/useRubricItems";
import { CPLRubric } from "@prisma/client";

interface RubricItemsTableProps {
  exhibitId: string;
}

const columns = [
  { key: "Rubric", label: "Rubric" },
  { key: "ScoreRange", label: "Score Range" },
  { key: "MinScore", label: "Minimum Score" },
];

export function RubricItemsTable({ exhibitId }: RubricItemsTableProps) {
  const { data, isLoading, error } = useRubricItems(exhibitId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Rubric Items</h3>
        <DataTable data={data} columns={columns} maxHeight="300px" />
    </div>
  );
}
