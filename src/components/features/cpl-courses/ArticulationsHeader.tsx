import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileSpreadsheet, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticulationHeaderProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
  onExport: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function ArticulationHeader({
  viewMode,
  onViewModeChange,
  onExport,
  children,
  className,
}: ArticulationHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 ",
        className
      )}
    >
      <div className="lg:w-full sm:w-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {children}
        <div className="flex flex-row justify-between items-center space-x-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && onViewModeChange(value)}
            className="mb-2 sm:mb-0"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            size="sm"
            variant="secondary"
            onClick={onExport}
            className="w-full sm:w-auto"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
