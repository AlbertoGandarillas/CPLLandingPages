import React, { useState } from "react";
import { useGetIndustryCertifications } from "@/hooks/useGetIndustryCertifications";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";

interface MostCommonIndCertificationsProps {
  onSelect: (creditRecommendation: string | null) => void;
  creditRecommendation?: string | null;
  catalogYearId?: string | null;
}

export const MostCommonIndCertifications = ({ 
  onSelect, 
  creditRecommendation,
  catalogYearId
}: MostCommonIndCertificationsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useGetIndustryCertifications(creditRecommendation ?? null, catalogYearId ?? null);
  console.log(data);
  const columns = [
    { key: "Title", label: "Title" },
    { key: "StudentsCount", label: "Student Count", headerAlign: "flex justify-end" },
  ];

  const filteredData =
    data?.filter(
      (item) =>
        item.Title &&
        (!filterValue || 
          item.Title.toLowerCase().includes(filterValue.toLowerCase()))
    ) || [];

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common CPL Exhibits:", error);
    return <div>Error loading Most Common CPL Exhibits</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter CPL Exhibits..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <div className="rounded-md border">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={(row) => onSelect(row.Title)}
          maxHeight="300px"
        />
      </div>
    </div>
  );
};
