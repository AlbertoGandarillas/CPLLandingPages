import React, { useState } from "react";
import * as XLSX from "xlsx";
import {} from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  ViewCPLCourses,
  ViewCPLEvidenceCompetency,
  ViewCPLIndustryCertifications,
} from "@prisma/client";
import { FileSpreadsheet, Grid, List } from "lucide-react";
import { ArticulationExport } from "@/app/types/ArticulationExport";
import SkeletonWrapper from "../shared/SkeletonWrapper";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
interface ExtendedViewCPLCourses extends ViewCPLCourses {
  Evidence?: ViewCPLEvidenceCompetency[];
  IndustryCertifications?: ViewCPLIndustryCertifications[];
}
interface ArticulationsTableProps {
  articulations: ExtendedViewCPLCourses[];
  loading: boolean;
  error?: Error | null;
  searchTerm: string;
}
export default function ArticulationsTable({
  articulations,
  loading,
  error,
  searchTerm,
}: ArticulationsTableProps) {
  const [selectedArticulation, setSelectedArticulation] =
    useState<ExtendedViewCPLCourses | null>(null);
  const [viewMode, setViewMode] = React.useState("grid");
  const filteredItems =
    searchTerm.length >= 3
      ? articulations.filter((articulation) => {
          const searchContent = `
      ${articulation.Units} 
      ${articulation.Course} 
      ${articulation.Evidence?.map((e) => e.EvidenCompetency).join(" ")}
          ${articulation.IndustryCertifications?.map(
            (ic) => ic.IndustryCertification
          ).join(" ")}
    `.toLowerCase();
          return searchContent.includes(searchTerm.toLowerCase());
        })
      : articulations;
  const isEmpty = filteredItems.length === 0 && !loading && !error;
  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Results</h3>
          <div className="w-full flex justify-between items-center space-x-2">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value)}
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
              variant="outline"
              onClick={() =>
                exportToExcel(filteredItems, "Articulations_Export")
              }
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>
        {error && <p>Error: {error.message}</p>}
        {isEmpty ? (
          <p className="text-center text-xl p-10 w-1/2 m-auto">
            If you have prior learning experience that you feel would qualify
            for CPL, but you don&apos;t see the discipline or course in our
            list, please email 
            <a href="mailto:cpl@norcocollege.edu">cpl@norcocollege.edu</a>
          </p>
        ) : (
          <SkeletonWrapper isLoading={loading} fullWidth={true} variant="table">
            {viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-3">
                {!loading &&
                  !error &&
                  filteredItems.map((articulation) => (
                    <Card key={articulation.OutlineID}>
                      <CardHeader className="bg-gray-100">
                        <CardTitle className="text-lg h-11 flex align-bottom">
                          {articulation.Subject} {articulation.CourseNumber} :{" "}
                          {articulation.CourseTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid">
                        <h3 className="text-base font-bold pt-4">
                          Credits : {articulation.Units}
                        </h3>
                        <div>
                          {articulation.IndustryCertifications &&
                            articulation.IndustryCertifications.length > 0 && (
                              <>
                                <h3 className="text-base font-bold">
                                  CPL Eligible Qualifications{" "}
                                </h3>
                                {articulation.IndustryCertifications?.map(
                                  (cert, index) => (
                                    <p className="text-sm" key={index}>
                                      {cert.IndustryCertification}
                                    </p>
                                  )
                                )}
                              </>
                            )}
                          {articulation.Evidence &&
                            articulation.Evidence.length > 0 && (
                              <>
                                <h3 className="text-base font-bold">
                                  Required Evidence:
                                </h3>
                                {articulation.Evidence?.map(
                                  (evidence, index) => (
                                    <p className="text-sm" key={index}>
                                      {evidence.EvidenCompetency}
                                    </p>
                                  )
                                )}
                              </>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-black ">
                    <TableHead className="font-bold">Subject</TableHead>
                    <TableHead className="text-center font-bold">
                      Course Number
                    </TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="text-center font-bold">
                      Credits
                    </TableHead>
                    <TableHead className="font-bold">
                      CPL Eligible Qualifications
                    </TableHead>
                    <TableHead className="font-bold">
                      Required Evidence
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((articulation) => (
                    <TableRow key={articulation.OutlineID}>
                      <TableCell className="text-center">
                        {articulation.Subject}
                      </TableCell>
                      <TableCell className="text-center">
                        {articulation.CourseNumber}
                      </TableCell>
                      <TableCell>{articulation.CourseTitle}</TableCell>
                      <TableCell className="text-center">
                        {articulation.Units}
                      </TableCell>
                      <TableCell>
                        {articulation.IndustryCertifications?.map(
                          (cert, index) => (
                            <p className="text-sm" key={index}>
                              {cert.IndustryCertification}
                            </p>
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        {articulation.Evidence?.map((evidence, index) => (
                          <p className="text-sm" key={index}>
                            {evidence.EvidenCompetency}
                          </p>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SkeletonWrapper>
        )}
      </div>
    </>
  );
}
const exportToExcel = (
  articulations: ExtendedViewCPLCourses[],
  fileName: string
): void => {
  const ws = XLSX.utils.json_to_sheet(
    articulations.map(
      (articulation): ArticulationExport => ({
        Subject: articulation.Subject ?? "",
        "Course Number": articulation.CourseNumber ?? "",
        "Course Title": articulation.CourseTitle ?? "",
        Units: articulation.Units ?? "",
        "Industry Certifications": articulation.IndustryCertifications?.map(
          (ic) => ic.IndustryCertification
        ).join(", "),
        "Required Evidence": articulation.Evidence?.map(
          (e) => e.EvidenCompetency
        )
          .join(", ")
          .toString(),
      })
    ) as any
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Articulations");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
