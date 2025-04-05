"use client";
import React from "react";
import { useExhibitArticulatedCourses } from "../../hooks/useExhibitArticulatedCourses";
import { CircleEllipsis, Info } from "lucide-react";
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

  // Group rows by Course and Criteria
  const groupedData = (data || []).reduce((acc, row) => {
    const key = `${row.Course}-${row.Criteria}`;
    if (!acc[key]) {
      acc[key] = {
        ...row,
        colleges: [row.College]
      };
    } else {
      if (!acc[key].colleges.includes(row.College)) {
        acc[key].colleges.push(row.College);
      }
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="mt-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Credit Recommendation</TableHead>
              <TableHead>College</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(groupedData).map((row, index) => (
              <TableRow
                key={index}
                className={`${
                  criteriaId === row.CriteriaID && outlineId === row.outline_id
                    ? "text-blue font-bold bg-muted"
                    : ""
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.CatalogDescription && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Info
                              className={`h-4 w-4 ${
                                criteriaId === row.CriteriaID &&
                                outlineId === row.outline_id
                                  ? "text-black font-bold"
                                  : ""
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            align="end"
                            sideOffset={5}
                            className="max-h-[calc(100vh-4rem)] overflow-y-auto" 
                          >
                            <p className="max-w-[400px] whitespace-normal break-words">
                              {row.CatalogDescription}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {row.Course} {row.CourseTitle}
                  </div>
                </TableCell>
                <TableCell>{row.Criteria}</TableCell>
                <TableCell>
                  {row.colleges.length > 1 ? (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger className="flex items-center gap-2">
                          <CircleEllipsis className="h-4 w-4" />
                          Articulated in Multiple Colleges
                        </TooltipTrigger>
                        <TooltipContent
                          side="left"
                          align="start"
                          sideOffset={5}
                        >
                          <p className="max-w-xs">{row.colleges.join(", ")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    row.colleges[0]
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
