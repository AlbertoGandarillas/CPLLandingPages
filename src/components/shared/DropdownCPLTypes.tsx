import React, { useState } from "react";
import { useCPLTypes } from "@/hooks/useCPLTypes";
import SkeletonWrapper from "../shared/SkeletonWrapper";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
interface DropdownCPLTypesProps {
  onCPLTypeSelect: (cplType: string | null) => void;
}
export const DropdownCPLTypes = ({onCPLTypeSelect}:DropdownCPLTypesProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isLoading, error } = useCPLTypes();

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onCPLTypeSelect(currentValue === "all" ? null : currentValue);
  };

  return (
    <SkeletonWrapper isLoading={isLoading} fullWidth={true} variant="table">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[auto] justify-between"
          >
            {value === "all"
              ? "All CPL Types"
              : value
              ? data?.find((item) => item.ID.toString() === value)
                  ?.CPLTypeDescription ?? "Unknown CPL Type"
              : "Select CPL Type..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[auto] p-0">
          <Command>
            <CommandInput placeholder="Search CPL Type..." />
            <CommandList>
              <CommandEmpty>No CPL Type found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all" onSelect={() => handleSelect("all")}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All CPL Types
                </CommandItem>
                {data?.map((row) => (
                  <CommandItem
                    key={row.ID}
                    value={row.CPLTypeDescription ?? ""}
                    onSelect={() => handleSelect(row.ID.toString())}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === row.ID.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {row.CPLTypeDescription ?? "Unknown CPL Type"}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  );
};
