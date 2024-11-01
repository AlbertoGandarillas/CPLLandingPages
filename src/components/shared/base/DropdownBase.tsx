import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";

interface DropdownBaseProps<T> {
  data?: T[];
  isLoading?: boolean;
  error?: any;
  selectedValue?: string | null;
  onSelect: (value: string | null) => void;
  getDisplayValue: (item: T) => string;
  getId: (item: T) => string | number;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  allItemsText?: string;
  showAllOption?: boolean;
  wrapWithSkeleton?: boolean;
}

export function DropdownBase<T>({
  data,
  isLoading,
  error,
  selectedValue,
  onSelect,
  getDisplayValue,
  getId,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  noResultsText = "No results found.",
  allItemsText = "All",
  showAllOption = true,
  wrapWithSkeleton = false,
}: DropdownBaseProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue.toString());
    } else {
      setValue("");
    }
  }, [selectedValue]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === "all" ? null : currentValue);
  };

  const content = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[auto] justify-between"
        >
          {value === "all"
            ? allItemsText
            : value
            ? data?.find((item) => getId(item).toString() === value)
              ? getDisplayValue(
                  data.find((item) => getId(item).toString() === value)!
                )
              : placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[auto] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem value="all" onSelect={() => handleSelect("all")}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {allItemsText}
                </CommandItem>
              )}
              {data?.map((item) => (
                <CommandItem
                  key={getId(item)}
                  value={getDisplayValue(item)}
                  onSelect={() => handleSelect(getId(item).toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === getId(item).toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getDisplayValue(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  if (error) {
    return <div>Error loading data</div>;
  }

  return wrapWithSkeleton ? (
    <SkeletonWrapper
      isLoading={isLoading ?? false}
      fullWidth={true}
      variant="table"
    >
      {content}
    </SkeletonWrapper>
  ) : (
    content
  );
}
