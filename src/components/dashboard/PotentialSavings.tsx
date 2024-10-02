import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { usePotentialSavings } from "@/hooks/usePotentialSavings";
import SkeletonWrapper from "../shared/SkeletonWrapper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import MainCard from "../shared/MainCard";
interface PotentialSavingsProps {
  cplType?: string | null;
  className?: string;
}
export const PotentialSavings = ({ cplType, className }: PotentialSavingsProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { data, isLoading, error } = usePotentialSavings(selectedType);
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="max-h-[350px] text-center overflow-y-auto grid grid-cols-1 gap-x-4">
        <MainCard
          title="Potential CPL Savings & Preservation of Funds (PoF), 20-Year Impact, College Metrics"
          className="w-full mt-4"
        >
          <div>
            <div className="m-4 flex justify-center">
              <RadioGroup
                className="flex space-x-4"
                defaultValue={selectedType ?? ""}
                onValueChange={(value) =>
                  setSelectedType(value === "" ? null : value)
                }
              >
                <div className="flex items-center">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1" className="ml-2">
                    All
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2" className="ml-2">
                    Military
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3" className="ml-2">
                    Working Adult
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="rounded-md border">
              <SkeletonWrapper
                isLoading={isLoading}
                fullWidth={true}
                variant="table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">College</TableHead>
                      <TableHead className="text-center">
                        Savings & PoF
                      </TableHead>
                      <TableHead className="text-center">
                        20-Year Impact
                      </TableHead>
                      <TableHead className="text-center">Combined</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-center">Avg Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((row) => (
                      <TableRow key={`${row.Sorder}-${row.CollegeID}`}>
                        <TableCell className="text-left">
                          {row.College}
                        </TableCell>
                        <TableCell className="text-center">
                          ${row.Savings}
                        </TableCell>
                        <TableCell className="text-center">
                          ${row.YearImpact}
                        </TableCell>
                        <TableCell className="text-center">
                          ${row.Combined}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.Students}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.AverageUnits}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </SkeletonWrapper>
            </div>
          </div>
        </MainCard>
      </CardContent>
    </Card>
  );
};
