import React, { useState } from "react";
import { useImplementedColleges } from "@/hooks/useImplementedColleges";
import SkeletonWrapper from "./SkeletonWrapper";
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
interface DropdownImplementedCollegesProps {
  onCollegeSelect: (collegeID: string | null) => void;
}
export const DropdownImplementedColleges = ({onCollegeSelect}:DropdownImplementedCollegesProps) => {
const [open, setOpen] = useState(false);
const [value, setValue] = useState("");
const { data, isLoading, error } = useImplementedColleges();

const handleSelect = (currentValue: string) => {
  setValue(currentValue === value ? "" : currentValue);
  setOpen(false);
  onCollegeSelect(currentValue === "all" ? null : currentValue);
};

  if (isLoading) {
    return (
      <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />
    );
  }

  if (error) {
    console.error("Error loading colleges:", error);
    return <div>Error loading colleges</div>;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[auto] justify-between"
        >
          {value === "all"
            ? "All Colleges"
            : value
            ? data?.find((item) => item.CollegeID.toString() === value)
                ?.College ?? "Unknown College"
            : "Select College..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[auto] p-0">
        <Command>
          <CommandInput placeholder="Search College..." />
          <CommandList>
            <CommandEmpty>No College found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="all" onSelect={() => handleSelect("all")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All Colleges
              </CommandItem>
              {data?.map((row) => (
                <CommandItem
                  key={row.CollegeID}
                  value={row.College ?? ""}
                  onSelect={() => handleSelect(row.CollegeID.toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === row.CollegeID.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {row.College ?? "Unknown College"}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
