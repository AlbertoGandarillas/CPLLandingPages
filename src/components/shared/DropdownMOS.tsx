import { useCPLMos } from "@/hooks/useCPLMos";
import { DropdownBase } from "@/components/shared/base/DropdownBase";

interface DropdownMOSProps {
  onMOSSelect: (mos: string | null) => void;
}

export const DropdownMOS = ({
  onMOSSelect,
}: DropdownMOSProps) => {
  const { data, isLoading, error } = useCPLMos();

  return (
    <DropdownBase
      data={data}
      isLoading={isLoading}
      error={error}
      onSelect={onMOSSelect}
      getDisplayValue={(item) => item.MOS ?? ""}
      getId={(item) => item.IndustryCertification ?? ""}
      placeholder="Select MOS..."
      searchPlaceholder="Search MOS..."
      noResultsText="No MOS found."
      allItemsText="All MOS"
      wrapWithSkeleton={false}
    />
  );
};
