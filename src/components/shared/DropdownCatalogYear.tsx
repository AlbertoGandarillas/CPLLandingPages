import React from "react";
import { useCatalogYears } from "@/hooks/useCatalogYears";
import { DropdownBase } from "./base/DropdownBase";

interface DropdownCatalogYearProps {
  selectedCatalogYear?: string | null;
  onCatalogYearSelect: (catalogYearID: string | null) => void;
  className?: string;
}

export const DropdownCatalogYear = ({
  selectedCatalogYear,
  onCatalogYearSelect,
  className,
}: DropdownCatalogYearProps) => {
  const { data, isLoading, error } = useCatalogYears();

  return (
    <DropdownBase
      className={className}
      data={data}
      isLoading={isLoading}
      error={error}
      selectedValue={selectedCatalogYear}
      onSelect={onCatalogYearSelect}
      getDisplayValue={(item) => item.CatalogYear}
      getId={(item) => item.ID}
      placeholder="Select Academic Year..."
      searchPlaceholder="Search Academic Year..."
      noResultsText="No Academic Year found."
      allItemsText="All Academic Years"
      wrapWithSkeleton={false}
    />
  );
};
