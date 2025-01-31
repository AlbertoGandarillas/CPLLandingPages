import { useIndustryCertifications } from "@/hooks/useIndustryCertifications";
import { DropdownBase } from "@/components/shared/base/DropdownBase";
import { useState } from "react";
import { useEffect } from "react";

interface DropdownIndustryCertificationsProps {
  onIndustryCertificationSelect: (industryCertification: string | null) => void;
  collegeId?: string | null;
  selectedIndustryCertification?: string | null;
  className?: string;
}

export const DropdownIndustryCertifications = ({
  onIndustryCertificationSelect,
  collegeId,
  selectedIndustryCertification,
  className
}: DropdownIndustryCertificationsProps) => {
  const { data, isLoading, error } = useIndustryCertifications(collegeId);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selectedIndustryCertification ? selectedIndustryCertification.toString() : "");
  }, [selectedIndustryCertification]);  

  const handleSelect = (newValue: string | null) => {
    setValue(newValue ? newValue.toString() : "");
    onIndustryCertificationSelect(newValue);
  };

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      selectedValue={value}
      onSelect={handleSelect}
      getDisplayValue={(item) => item.IndustryCertification ?? ""}
      getId={(item) => item.IndustryCertification.toString()}
      placeholder="Select Industry Certification..."
      searchPlaceholder="Search Industry Certification..."
      noResultsText="No Industry Certification found."
      allItemsText="All Industry Certifications"
      wrapWithSkeleton={false}
      className={className}
    />
  );
};
