import { useColleges } from "@/hooks/useColleges";
import { DropdownBase } from "@/components/shared/base/DropdownBase";

interface DropdownCollegesProps {
  selectedCollege?: string | null;
  onCollegeSelect: (collegeID: string | null) => void;
}

export const DropdownColleges = ({
  selectedCollege,
  onCollegeSelect,
}: DropdownCollegesProps) => {
  const { data, isLoading, error } = useColleges();

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      selectedValue={selectedCollege}
      onSelect={onCollegeSelect}
      getDisplayValue={(item) => item.College}
      getId={(item) => item.CollegeID}
      placeholder="Select College..."
      searchPlaceholder="Search College..."
      noResultsText="No College found."
      allItemsText="All Colleges"
      wrapWithSkeleton={false}
    />
  );
};
