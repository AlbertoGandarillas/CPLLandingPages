import { Input } from "@/components/ui/input";
import { CircleX, Search } from "lucide-react";
import { useState, useCallback } from "react";

import debounce from "lodash/debounce";
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search by keyword...",
  debounceTime = 300,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedOnSearch = useCallback(
    debounce((term: string) => onSearch(term), debounceTime),
    [onSearch, debounceTime]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    debouncedOnSearch(newTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };
  return (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <CircleX
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={clearSearch}
          />
        )}
      </div>
    </>
  );
}
