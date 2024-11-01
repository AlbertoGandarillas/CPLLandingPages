import { useIndustryCertifications } from "@/hooks/useIndustryCertifications";
import { DropdownBase } from "@/components/shared/base/DropdownBase";

interface DropdownIndustryCertificationsProps {
  onIndustryCertificationSelect: (industryCertification: string | null) => void;
  collegeId?: string | null;
}

export const DropdownIndustryCertifications = ({
  onIndustryCertificationSelect,
  collegeId,
}: DropdownIndustryCertificationsProps) => {
  const { data, isLoading, error } = useIndustryCertifications(collegeId);

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={onIndustryCertificationSelect}
      getDisplayValue={(item) => item.IndustryCertification ?? ""}
      getId={(item) => item.IndustryCertification.toString()}
      placeholder="Select Industry Certification..."
      searchPlaceholder="Search Industry Certification..."
      noResultsText="No Industry Certification found."
      allItemsText="All Industry Certifications"
      wrapWithSkeleton={false}
    />
  );
};
