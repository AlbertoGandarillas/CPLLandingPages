import React, { useState } from "react";
import { useIndustryCertifications } from "@/hooks/useIndustryCertifications";
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
interface DropdownIndustryCertificationsProps {
  onIndustryCertificationSelect: (industryCertification: string | null) => void;
  collegeId?: string | null;
}
export const DropdownIndustryCertifications = ({
  onIndustryCertificationSelect, collegeId
}: DropdownIndustryCertificationsProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isLoading, error } = useIndustryCertifications(collegeId);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onIndustryCertificationSelect(currentValue === "all" ? null : currentValue);
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
              ? "All Approved Opportunities"
              : value
              ? data?.find(
                  (item) => item.IndustryCertification.toString() === value
                )?.IndustryCertification ?? "Unknown Approved Opportunity"
              : "Select Approved Opportunity..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[auto] p-0">
          <Command>
            <CommandInput placeholder="Search Approved Opportunity..." />
            <CommandList>
              <CommandEmpty>No Approved Opportunity found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all" onSelect={() => handleSelect("all")}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Approved Opportunities
                </CommandItem>
                {data?.map((row) => (
                  <CommandItem
                    key={row.IndustryCertification}
                    value={row.IndustryCertification ?? ""}
                    onSelect={() => handleSelect(row.IndustryCertification.toString())}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === row.IndustryCertification.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {row.IndustryCertification ?? "Unknown Approved Opportunity"}
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
