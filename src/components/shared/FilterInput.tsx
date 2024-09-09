import { ChangeEvent, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
interface FilterInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function FilterInput({
  value,
  onChange,
  ...rest
}: FilterInputProps) {
  const handleClear = () => {
    const event: ChangeEvent<HTMLInputElement> = {
      target: {
        value: "", 
      },
    } as ChangeEvent<HTMLInputElement>; 
    onChange(event); 
  };
  return (
    <div className="p-2 flex items-center">
      <Input value={value} onChange={onChange} {...rest} />
      {value && (
        <CircleX
          className="ml-2 text-slate-200 cursor-pointer"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
