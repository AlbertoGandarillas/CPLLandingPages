import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
interface SelectLearningModeProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  className?: string;
}

export default function SelectCPLType({
  selectedType,
  setSelectedType,
  className,
}: SelectLearningModeProps) {
  const handleTypeChange = (value: string) => {
    setSelectedType(value || "all");
  };

  return (
    <ToggleGroup
      type="single"
      value={selectedType || "all"}
      onValueChange={handleTypeChange}
      className={`p-1 rounded-lg ${className}`}
    >
      <ToggleGroupItem
        value="all"
        aria-label="All"
        className="data-[state=on]:bg-muted"
      >
        All
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Military"
        aria-label="Military"
        className="data-[state=on]:bg-muted"
      >
        Military
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Apprentice"
        aria-label="Apprentice"
        className="data-[state=on]:bg-muted"
      >
        Apprentice
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Non-Military"
        aria-label="Non-Military"
        className="data-[state=on]:bg-muted"
      >
        Non-Military
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
