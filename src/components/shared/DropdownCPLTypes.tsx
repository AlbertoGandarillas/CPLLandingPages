import { useCPLTypes } from "@/hooks/useCPLTypes";
import { DropdownBase } from "@/components/shared/base/DropdownBase";
import { useEffect, useState } from "react";

interface DropdownCPLTypesProps {
  onCPLTypeSelect: (cplType: string | null) => void;
  selectedType?: string | null;
}

export const DropdownCPLTypes = ({ onCPLTypeSelect, selectedType }: DropdownCPLTypesProps) => {
  const { data, isLoading, error } = useCPLTypes();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selectedType ? selectedType.toString() : "");
  }, [selectedType]);

  const handleSelect = (newValue: string | null) => {
    setValue(newValue ? newValue.toString() : "");
    onCPLTypeSelect(newValue);
  };

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={handleSelect}
      getDisplayValue={(item) => item.CPLTypeDescription ?? ""}
      getId={(item) => item.ID.toString()}
      placeholder="Select CPL Type..."
      searchPlaceholder="Search CPL Type..."
      noResultsText="No CPL Type found."
      allItemsText="All CPL Types"
      wrapWithSkeleton={false}
      selectedValue={value}
    />
  );
};
