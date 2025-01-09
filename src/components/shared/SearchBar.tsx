import { Input } from "@/components/ui/input";
import { CircleX, Search } from "lucide-react";
import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
}

export interface SearchBarRef {
  clear: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  (
    {
      onSearch,
      onClear,
      placeholder = "Search...",
      className = "",
      inputClassName = "",
      value = "",
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState(value);

    const debouncedOnSearch = useCallback(
      (term: string) => {
        const debouncedFn = debounce((searchTerm: string) => {
          onSearch(searchTerm);
        }, 300);
        debouncedFn(term);
      },
      [onSearch]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newTerm = e.target.value;
      setSearchTerm(newTerm);
      debouncedOnSearch(newTerm);
    };

    const handleClear = () => {
      setSearchTerm("");
      onSearch("");
      onClear?.();
    };

    useImperativeHandle(ref, () => ({
      clear: handleClear,
    }));

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          className={`pl-10 pr-10 w-full ${inputClassName}`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <CircleX
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={handleClear}
          />
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
