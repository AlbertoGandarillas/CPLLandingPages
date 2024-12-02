import React, { useState } from "react";
import { useMostCommonCIDs } from "@/hooks/useMostCommonCIDs";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";

interface MostCommonCIDsProps {
  onSelect: (CIDNumber: string | null) => void;
}

export const MostCommonCIDs = ({ onSelect }: MostCommonCIDsProps) => {
  const [filterValue, setFilterValue] = useState("");
  const { data, isLoading, error } = useMostCommonCIDs();

  const columns = [
    { key: "CIDNumber", label: "CID Number" },
    { key: "CIDDescriptor", label: "CID Descriptor" },
    { key: "Count", label: "Count" },
  ];

  const filteredData =
    data?.filter(
      (item) =>
        item.CIDNumber &&
        item.CIDDescriptor &&
        (item.CIDNumber.toLowerCase().includes(filterValue.toLowerCase()) ||
         item.CIDDescriptor.toLowerCase().includes(filterValue.toLowerCase()))
    ) || [];

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading Most Common CIDs:", error);
    return <div>Error loading Most Common CIDs</div>;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter CIDs..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="w-full"
        />
      </div>
      <div className="rounded-md border">
        <DataTable
          data={filteredData}
          columns={columns}
          onRowClick={(row) => onSelect(row.CIDNumber)}
          maxHeight="300px"
        />
      </div>
    </div>
  );
};
