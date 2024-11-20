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
        className="data-[state=on]:bg-blue-100"
      >
        All
      </ToggleGroupItem>
      <ToggleGroupItem
        value="occupation"
        aria-label="Occupation"
        className="data-[state=on]:bg-blue-100"
      >
        Occupations
      </ToggleGroupItem>
      <ToggleGroupItem
        value="MAP"
        aria-label="MAP"
        className="data-[state=on]:bg-blue-100"
      >
        MAP
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
