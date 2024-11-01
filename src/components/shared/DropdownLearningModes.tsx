import React, { useState } from "react";
import { DropdownBase } from "@/components/shared/base/DropdownBase";
import { useLearningModes } from "@/hooks/useLearningModes";

interface DropdownLearningModesProps {
  onLearningModeSelect: (learningMode: string | null) => void;
}

export const DropdownLearningModes = ({
  onLearningModeSelect,
}: DropdownLearningModesProps) => {
  const { data, isLoading, error } = useLearningModes();

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={onLearningModeSelect}
      getDisplayValue={(item) => item.CPLModeofLearningDescription ?? ""}
      getId={(item) => item.ID.toString()}
      placeholder="Select Learning Mode..."
      searchPlaceholder="Search Learning Mode..."
      noResultsText="No Learning Mode found."
      allItemsText="All Learning Modes"
      wrapWithSkeleton={false}
    />
  );
};
