import React, { useEffect, useState } from "react";
import { DropdownBase } from "@/components/shared/base/DropdownBase";
import { useLearningModes } from "@/hooks/useLearningModes";

interface DropdownLearningModesProps {
  onLearningModeSelect: (learningMode: string | null) => void;
  selectedMode?: string | null;
  className?: string;
}

export const DropdownLearningModes = ({
  onLearningModeSelect,
  selectedMode,
  className
}: DropdownLearningModesProps) => {
  const { data, isLoading, error } = useLearningModes();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selectedMode ? selectedMode.toString() : "");
  }, [selectedMode]);

  const handleSelect = (newValue: string | null) => {
    setValue(newValue ? newValue.toString() : "");
    onLearningModeSelect(newValue);
  };

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={handleSelect}
      getDisplayValue={(item) => item.CPLModeofLearningDescription ?? ""}
      getId={(item) => item.ID.toString()}
      placeholder="Select Learning Mode..."
      searchPlaceholder="Search Learning Mode..."
      noResultsText="No Learning Mode found."
      allItemsText="All Learning Modes"
      wrapWithSkeleton={false}
      selectedValue={value}
      className={className}
    />
  );
};
