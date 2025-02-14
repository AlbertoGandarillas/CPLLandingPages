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
  catalogYearId?: string | null;
}
export const MostCommonIndustryCertifications = ({
  creditRecommendation,
  className,
  catalogYearId
}: MostCommonIndustryCertificationsProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { data, isLoading, error } = useGetIndustryCertifications(creditRecommendation ?? null, catalogYearId ?? null);
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
                      <TableHead className="text-center">Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((row, index) => (
                      <TableRow key={`${index}`}>
                        <TableCell className="text-left">
                          {row.Title}
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
