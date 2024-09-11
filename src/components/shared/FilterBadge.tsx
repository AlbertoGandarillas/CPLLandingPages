import { X } from "lucide-react";
interface CriteriaBadgeProps {
  criteria: string;
  onClear: () => void;
  className?: string;
}
export default function FilterBadge({
  criteria,
  onClear,
  className = "",
}: CriteriaBadgeProps) {
  return (
    <div className={`p-2 flex justify-between items-center ${className}`}>
      <div className="bg-blue-100 text-blue-800 w-full text-sm font-semibold p-3 rounded-md flex justify-between items-center">
        <p>{criteria}</p>
        <div className="" onClick={onClear} aria-label="Remove criteria">
          <X className="w-[16px] cursor-pointer h-[16px]" />
        </div>
      </div>
    </div>
  );
}
