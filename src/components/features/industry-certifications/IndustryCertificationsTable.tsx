"use client";
import CertificationsTable from "./CertificationsTable";
import { useCallback, useEffect, useState } from "react";
import FilterInput from "../../shared/FilterInput";
import CriteriaBadge from "../../shared/FilterBadge";
import debounce from "lodash/debounce";
import { useIndustryCertifications } from "@/hooks/useIndustryCertifications";

interface IndustryCertificationsTableProps {
  onIndustryCertificationSelect: (industryCertification: string) => void;
  collegeId?: string | null;
}

export default function IndustryCertificationsTable({
  onIndustryCertificationSelect,
  collegeId,
}: IndustryCertificationsTableProps) {
  const {
    data: industryCertifications,
    isLoading,
    error,
  } = useIndustryCertifications(collegeId);
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

  const debouncedSetFilterText = useCallback((value: string) => {
    debounce((text: string) => {
      setFilterText(text);
    }, 300)(value);
  }, []);

  useEffect(() => {
    setFilterText(filterText);
    return () => {
    };
  }, [filterText]);

  return (
    <div className="h-[350px] overflow-auto">
      <div className="p-2">
        <FilterInput
          placeholder="Filter..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          autoFocus
          className="custom-input-class m-2"
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
            ic.IndustryCertification.toLowerCase().includes(
              filterText.toLowerCase()
            )
          ) ?? []
        }
        onRowClick={handleCertificationClick}
        loading={isLoading}
        error={error}
      />
    </div>
  );
}
