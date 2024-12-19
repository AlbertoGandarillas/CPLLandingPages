import React, { useState, useMemo } from "react";
import { useMostCommonCRs } from "@/hooks/useMostCommonCRs";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";

interface MostCommonCRsProps {
  onSelect: (Criteria: string | null) => void;
}

export const MostCommonCRs = ({
  onSelect,
}: MostCommonCRsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useMostCommonCRs();

  const columns = [
    { key: "Criteria", label: "Credit Recommendation" },
    { key: "Count", label: "Count", headerAlign: "flex justify-end" },
  ];

  const filteredData = useMemo(() => {
    return data?.filter(
      (item) =>
        item.Criteria &&
        item.Criteria.toLowerCase().includes(filterValue.toLowerCase())
    ) || [];
  }, [data, filterValue]);

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common CRs:", error);
    return <div>Error loading Most Common CRs</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter credit recommendations..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <div className="rounded-md border">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={(row) => onSelect(row.Criteria)}
          maxHeight="300px"
        />
      </div>
    </div>
  );
};
