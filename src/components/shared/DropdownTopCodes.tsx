import { useMostCommonTopcodes } from "@/hooks/useMostCommonTopcodes";
import { DropdownBase } from "@/components/shared/base/DropdownBase";
import { useEffect, useState } from "react";

interface TopCodeSelection {
  code: string | null;
  title: string | null;
}

interface DropdownTopCodesProps {
  onTopCodeSelect: (selection: TopCodeSelection) => void;
  selectedTopCode?: TopCodeSelection;
  searchPlaceholder?: string;
}

export const DropdownTopCodes = ({
  onTopCodeSelect,
  selectedTopCode,
  searchPlaceholder,
}: DropdownTopCodesProps) => {
  const { data, isLoading, error } = useMostCommonTopcodes();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selectedTopCode?.code ? selectedTopCode.code.toString() : "");
  }, [selectedTopCode]);

  const handleSelect = (newValue: string | null) => {
    setValue(newValue ? newValue.toString() : "");
    
    if (!newValue) {
      onTopCodeSelect({ code: null, title: null });
      return;
    }

    const selectedItem = data?.find(item => item.TopCode?.toString() === newValue);
    onTopCodeSelect({
      code: newValue,
      title: selectedItem?.Program_Title ?? null
    });
  };

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={handleSelect}
      getDisplayValue={(item) => item.Program_Title ?? ""}
      getId={(item) => item.TopCode?.toString() ?? ""}
      placeholder="Select Top Code..."
      searchPlaceholder={searchPlaceholder || "Search Top Code..."}
      noResultsText="No Top Code found."
      allItemsText="All Top Codes"
      wrapWithSkeleton={false}
      selectedValue={value}
    />
  );
};
