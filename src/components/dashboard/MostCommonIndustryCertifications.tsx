import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useGetIndustryCertifications } from "@/hooks/useGetIndustryCertifications";
import SkeletonWrapper from "../shared/SkeletonWrapper";
import { TooltipContent, Tooltip } from "../ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { HelpCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
interface MostCommonIndustryCertificationsProps {
  creditRecommendation?: string | null;
  className?: string;
}
export const MostCommonIndustryCertifications = ({
  creditRecommendation,
  className,
}: MostCommonIndustryCertificationsProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { data, isLoading, error } = useGetIndustryCertifications(selectedType);
  return (
          <ScrollArea className="h-[350px]">
            <div className="rounded-md border">
              <SkeletonWrapper
                isLoading={isLoading}
                fullWidth={true}
                variant="table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Title</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((row, index) => (
                      <TableRow key={`${row.SortOrder}-${index}`}>
                        <TableCell className="text-left">
                          {row.Colleges && (
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                  <HelpCircle className={`h-4 w-4`} />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  align="start"
                                  sideOffset={5}
                                >
                                  <p className="max-w-xs">{row.Colleges}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {row.Title}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.CPLType}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.StudentsCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </SkeletonWrapper>
            </div>
          </ScrollArea>
  );
};
