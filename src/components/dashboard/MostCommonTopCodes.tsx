import React, { useState } from "react";
import { useMostCommonTopcodes } from "@/hooks/useMostCommonTopcodes";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";

interface TopCodeSelection {
  code: string | null;
  title: string | null;
}

interface MostCommonTopCodesProps {
  onSelect: (selection: TopCodeSelection) => void;
  catalogYearId?: string | null;
}

export const MostCommonTopCodes = ({
  onSelect,
  catalogYearId,
}: MostCommonTopCodesProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useMostCommonTopcodes(catalogYearId);

  console.log("MostCommonTopCodes - Data:", data);

  const columns = [
    { key: "Program_Title", label: "Tops Code" },
    { key: "Count", label: "Count", headerAlign: "flex justify-end" },
  ];

  const filteredData =
    data?.filter(
      (item) =>
        item.Program_Title &&
        item.Program_Title.toLowerCase().includes(filterValue.toLowerCase())
    ) || [];

  console.log("MostCommonTopCodes - Filtered Data:", filteredData);

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common Top Codes:", error);
    return <div>Error loading Most Common Top Codes</div>;
  }

  const handleRowClick = (row: any) => {
    onSelect({
      code: row.TopCode?.toString() ?? null,
      title: row.Program_Title ?? null,
    });
  };

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter Top Codes..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <div className="rounded-md border">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          maxHeight="300px"
        />
      </div>
    </div>
  );
};
