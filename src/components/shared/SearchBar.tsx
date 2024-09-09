import { Input } from "@/components/ui/input";
import { CircleX, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import debounce from "lodash/debounce";
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
 const debouncedOnSearch = useCallback(debounce(onSearch, 300), [onSearch]);

 useEffect(() => {
   debouncedOnSearch(searchTerm);
   return () => {
     debouncedOnSearch.cancel();
   };
 }, [searchTerm, debouncedOnSearch]);

  return (
    <>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by keyword..."
                className="pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <CircleX
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
    </>
  );
}
