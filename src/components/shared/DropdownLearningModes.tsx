import React, { useState } from "react";
import { useLearningModes } from "@/hooks/useLearningModes";
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
interface DropdownLearningModesProps {
  onLearningModeSelect: (learningMode: string | null) => void;
}
export const DropdownLearningModes = ({onLearningModeSelect}:DropdownLearningModesProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data, isLoading, error } = useLearningModes();

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onLearningModeSelect(currentValue === "all" ? null : currentValue);
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
              ? "All Learning Modes"
              : value
              ? data?.find((item) => item.ID.toString() === value)
                  ?.CPLModeofLearningDescription ?? "Unknown Learning Mode"
              : "Select Learning Mode..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[auto] p-0">
          <Command>
            <CommandInput placeholder="Search Learning Mode..." />
            <CommandList>
              <CommandEmpty>No Learning Modes found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all" onSelect={() => handleSelect("all")}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Learning Modes
                </CommandItem>
                {data?.map((row) => (
                  <CommandItem
                    key={row.ID}
                    value={row.CPLModeofLearningDescription ?? ""}
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
                    {row.CPLModeofLearningDescription ??
                      "Unknown Learning Mode"}
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
