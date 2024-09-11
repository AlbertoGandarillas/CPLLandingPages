import { ChangeEvent, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
interface FilterInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}
export default function FilterInput({ value, onChange, onClear, ...rest }: FilterInputProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      const event: ChangeEvent<HTMLInputElement> = {
        target: { value: "" },
      } as ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };
  return (
    <div className="relative flex items-center">
      <Input value={value} onChange={onChange} {...rest} />
      {value && (
        <CircleX
          className="absolute right-3 text-gray-400 cursor-pointer"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
