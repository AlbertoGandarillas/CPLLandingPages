import { useCPLTypes } from "@/hooks/useCPLTypes";
import { DropdownBase } from "@/components/shared/base/DropdownBase";

interface DropdownCPLTypesProps {
  onCPLTypeSelect: (cplType: string | null) => void;
}

export const DropdownCPLTypes = ({ onCPLTypeSelect }: DropdownCPLTypesProps) => {
  const { data, isLoading, error } = useCPLTypes();

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={onCPLTypeSelect}
      getDisplayValue={(item) => item.CPLTypeDescription ?? ""}
      getId={(item) => item.ID.toString()}
      placeholder="Select CPL Type..."
      searchPlaceholder="Search CPL Type..."
      noResultsText="No CPL Type found."
      allItemsText="All CPL Types"
      wrapWithSkeleton={false}
    />
  );
};
