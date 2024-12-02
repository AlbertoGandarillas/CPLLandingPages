import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
interface SelectCPLTypeProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export default function SelectCPLType({
  selectedType,
  setSelectedType,
}: SelectCPLTypeProps) {
  const handleTypeChange = (value: string) => {
    setSelectedType(value || "all");
  };

  return (
    <ToggleGroup
      type="single"
      value={selectedType || "all"}
      onValueChange={handleTypeChange}
      className="p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="all"
        aria-label="All"
        className="data-[state=on]:bg-muted"
      >
        All
      </ToggleGroupItem>
      <ToggleGroupItem
        value="occupation"
        aria-label="Military CPL"
        className="data-[state=on]:bg-muted"
      >
        Military CPL
      </ToggleGroupItem>
      <ToggleGroupItem
        value="MAP"
        aria-label="Non-Military CPL"
        className="data-[state=on]:bg-muted"
      >
        Non-Military CPL
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
