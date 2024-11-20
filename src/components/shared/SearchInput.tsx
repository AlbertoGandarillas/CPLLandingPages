import { Input } from "@/components/ui/input";
import { CircleX, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search by keyword...",
  className,
  inputClassName,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Handle debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Only call onSearch when debounced value changes
  useEffect(() => {
    if (debouncedTerm.length >= 3 || debouncedTerm.length === 0) {
      onSearch(debouncedTerm);
    }
  }, [debouncedTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        className={`pl-10 pr-10 w-full ${inputClassName}`}
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <CircleX
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={clearSearch}
        />
      )}
    </div>
  );
} 