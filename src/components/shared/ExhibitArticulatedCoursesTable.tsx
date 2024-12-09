"use client";
import React from "react";
import { useExhibitArticulatedCourses } from "../../hooks/useExhibitArticulatedCourses";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExhibitArticulatedCoursesTableProps {
  exhibitId: string;
  criteriaId?: number;
  outlineId?: number;
}

export function ExhibitArticulatedCoursesTable({ exhibitId, criteriaId, outlineId }: ExhibitArticulatedCoursesTableProps) {
  const { data, isLoading, error } = useExhibitArticulatedCourses(exhibitId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Course</TableHead>
              <TableHead>Credit Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).map((row, index) => (
              <TableRow key={index} className={`${criteriaId === row.CriteriaID && outlineId === row.outline_id ? "bg-muted" : ""}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.Course}
                    {row.CatalogDescription && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start" sideOffset={5}>
                            <p className="max-w-xs">{row.CatalogDescription}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{row.Criteria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
