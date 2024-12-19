import React, { useState } from "react";
import { useGetIndustryCertifications } from "@/hooks/useGetIndustryCertifications";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";

interface MostCommonIndCertificationsProps {
  onSelect: (creditRecommendation: string | null) => void;
  creditRecommendation?: string | null;
}

export const MostCommonIndCertifications = ({ 
  onSelect, 
  creditRecommendation 
}: MostCommonIndCertificationsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useGetIndustryCertifications(creditRecommendation ?? null);

  const columns = [
    { key: "Title", label: "Title" },
    { key: "StudentsCount", label: "Students Count", headerAlign: "flex justify-end" },
  ];

  const filteredData =
    data?.filter(
      (item) =>
        item.Title &&
        item.Colleges &&
        (!filterValue || 
          item.Title.toLowerCase().includes(filterValue.toLowerCase()))
    ) || [];

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common Industry Certifications:", error);
    return <div>Error loading Most Common CRs</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter Industry Certifications..."
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
