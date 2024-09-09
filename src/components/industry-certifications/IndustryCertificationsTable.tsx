"use client";
import CertificationsTable from "./CertificationsTable";
import { useCallback, useEffect, useState } from "react";
import FilterInput from "../shared/FilterInput";
import CriteriaBadge from "../shared/FilterBadge";
import { ViewCPLCommonQualifications } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
interface IndustryCertificationsTableProps {
  onIndustryCertificationSelect: (industryCertifiction: string) => void;
  collegeId: string ;
}
export default function IndustryCertificationsTable({
  onIndustryCertificationSelect,
  collegeId
}: IndustryCertificationsTableProps) {
  const {
    data: industryCertifications,
    error,
    isLoading,
  } = useQuery<ViewCPLCommonQualifications[]>({
    queryKey: ["industryCertifications", collegeId], // Include collegeId in queryKey for correct caching
    queryFn: () =>
      fetch(`/api/industry-certifications?collegeId=${collegeId}`).then((res) =>
        res.json()
      ),
  });
  const [filterText, setFilterText] = useState("");
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
  const handleCertificationClick = (industryCertification: string) => {
    setSelectedIndustryCertification(industryCertification);
    onIndustryCertificationSelect(industryCertification);
  };
  const onClearCertification = () => {
    setSelectedIndustryCertification(null);
    setFilterText("");
    onIndustryCertificationSelect("");
  };
   const debouncedSetFilterText = useCallback(debounce(setFilterText, 300), []);
    useEffect(() => {
      debouncedSetFilterText(filterText);
      return () => {
        debouncedSetFilterText.cancel();
      };
    }, [filterText, debouncedSetFilterText]);
  return (
    <div className="h-[350px] overflow-auto">
      <div className="p-2">
        <FilterInput
          placeholder="Filter..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          autoFocus
          className="custom-input-class"
          type="text"
        />
      </div>
      {selectedIndustryCertification && (
        <CriteriaBadge
          criteria={selectedIndustryCertification}
          onClear={onClearCertification}
        />
      )}
      <CertificationsTable
        data={
          industryCertifications?.filter((ic) =>
            ic.IndustryCertification.toLowerCase().includes(filterText.toLowerCase())
          ) ?? []
        }
        onRowClick={handleCertificationClick}
        loading={isLoading}
        error={error}
      />
    </div>
  );
}
