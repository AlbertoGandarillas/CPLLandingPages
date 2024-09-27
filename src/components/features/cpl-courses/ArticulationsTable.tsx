import React, { useState } from "react";
import * as XLSX from "xlsx";
import {} from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  ViewCPLCourses,
  ViewCPLEvidenceCompetency,
  ViewCPLIndustryCertifications,
  ACEExhibitCriteria,
} from "@prisma/client";
import { FileSpreadsheet, Grid, List } from "lucide-react";
import { ArticulationExport } from "@/app/types/ArticulationExport";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
interface ExtendedViewCPLCourses extends ViewCPLCourses {
  IndustryCertifications?: (ViewCPLIndustryCertifications & {
    Evidences?: ViewCPLEvidenceCompetency[];
    CreditRecommendations?: ACEExhibitCriteria[];
  })[];
}
interface ArticulationsTableProps {
  articulations: ExtendedViewCPLCourses[];
  loading: boolean;
  error?: Error | null;
  searchTerm: string;
  CPLAssistantEmail?: string;
  showCollegeName?: boolean;
  children?: React.ReactNode;
}
export default function ArticulationsTable({
  articulations,
  loading,
  error,
  searchTerm,
  CPLAssistantEmail,
  showCollegeName,
  children,
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
      ${articulation.College}
      ${articulation.IndustryCertifications?.map(
        (ic) => `
              ${ic.IndustryCertification}
              ${ic.Evidences?.map((e) => e.EvidenCompetency).join(" ")}
              ${ic.CreditRecommendations?.map((cr) => cr.Criteria).join(" ")}
            `
      ).join(" ")}
    `.toLowerCase();
          return searchContent.includes(searchTerm.toLowerCase());
        })
      : articulations;
  const isEmpty = filteredItems.length === 0 && !loading && !error;
  const hasMilitaryCPLType = (articulation: ExtendedViewCPLCourses) => {
    return articulation.IndustryCertifications?.some(
      (cert) => cert.CPLTypeDescription === "Military"
    );
  };
  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <h3 className="text-xl font-semibold text-white">Results</h3>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {children}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value)}
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
              variant="outline"
              onClick={() =>
                exportToExcel(filteredItems, "Articulations_Export")
              }
              className="w-full sm:w-auto"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>
        {error && <p>Error: {error.message}</p>}
        {isEmpty ? (
          <p className="text-center text-xl p-4 sm:p-10 w-full sm:w-1/2 m-auto">
            If you have prior learning experience that you feel would qualify
            for CPL, but you don&apos;t see the discipline or course in our
            list,
            {CPLAssistantEmail ? (
              <>
                please email{" "}
                <a href={`mailto:${CPLAssistantEmail}`}>{CPLAssistantEmail}</a>
              </>
            ) : (
              <>please contact us.</>
            )}
             
          </p>
        ) : (
          <SkeletonWrapper isLoading={loading} fullWidth={true} variant="table">
            {viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {!loading &&
                  !error &&
                  filteredItems.map((articulation) => (
                    <Card
                      key={articulation.OutlineID}
                      className="flex flex-col"
                    >
                      <CardHeader className="bg-gray-100 flex-shrink-0">
                        <CardTitle className="text-md h-auto flex align-bottom">
                          {articulation.Subject} {articulation.CourseNumber} :{" "}
                          {articulation.CourseTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid flex-grow">
                        <div className="">
                          <h4 className="text-sm font-bold pt-4">
                            {showCollegeName && (
                              <p>College : {articulation.College}</p>
                            )}
                            Credits : {articulation.Units}
                          </h4>
                          <div className="overflow-y-auto max-h-48">
                            {articulation.IndustryCertifications &&
                              articulation.IndustryCertifications.length >
                                0 && (
                                <>
                                  <h4 className="text-sm font-bold">
                                    Possible Qualifications
                                  </h4>
                                  {articulation.IndustryCertifications.map(
                                    (cert, index) => (
                                      <div key={index}>
                                        <CertificationHoverCard
                                          industryCertification={
                                            cert.IndustryCertification ||
                                            undefined
                                          }
                                          cplType={
                                            cert.CPLTypeDescription || null
                                          }
                                          learningMode={
                                            cert.CPLModeofLearningDescription ||
                                            null
                                          }
                                          versionNumber={
                                            cert.VersionNumber || undefined
                                          }
                                          evidences={cert.Evidences || []}
                                          crs={cert.CreditRecommendations || []}
                                        />
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {hasMilitaryCPLType(articulation) && (
                          <p className="text-xs text-sky-950 mt-2 font-semibold">
                            * This has military type possible qulification,
                            upload your JST for personalized details.
                          </p>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-black ">
                    {showCollegeName && (
                      <TableHead className="font-bold">College</TableHead>
                    )}
                    <TableHead className="font-bold">Subject</TableHead>
                    <TableHead className="text-center font-bold">
                      Course Number
                    </TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="text-center font-bold">
                      Credits
                    </TableHead>
                    <TableHead className="font-bold">
                      Possible Qualifications
                    </TableHead>
                    <TableHead className="font-bold">
                      Required Evidence
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((articulation) => (
                    <TableRow key={articulation.OutlineID}>
                      {showCollegeName && (
                        <TableCell>{articulation.College}</TableCell>
                      )}
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
                        {articulation.IndustryCertifications?.map(
                          (cert, index) => (
                            <div key={index}>
                              <p className="text-sm font-semibold">
                                {cert.IndustryCertification}
                              </p>
                              {cert.Evidences && cert.Evidences.length > 0 && (
                                <ul className="list-disc list-inside ml-4">
                                  {cert.Evidences.map(
                                    (evidence, evidenceIndex) => (
                                      <li
                                        key={evidenceIndex}
                                        className="text-xs"
                                      >
                                        {evidence.EvidenCompetency}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          )
                        )}
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
          (ic) => {
            let certString = ic.IndustryCertification ?? "";
            if (ic.Evidences && ic.Evidences.length > 0) {
              certString += ` (Evidence: ${ic.Evidences.map(
                (e) => e.EvidenCompetency
              ).join(", ")})`;
            }
            return certString;
          }
        ).join("; "),
        "Required Evidence": articulation.IndustryCertifications?.flatMap(
          (ic) => ic.Evidences?.map((e) => e.EvidenCompetency) ?? []
        ).join(", "),
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Articulations");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

interface Evidence {
  ExhibitID: number;
  EvidenceID: number;
  EvidenCompetency: string | null;
}

const CertificationHoverCard: React.FC<{
  industryCertification: string | null | undefined;
  versionNumber?: string | null;
  cplType?: string | null;
  learningMode?: string | null;
  evidences: Evidence[];
  crs: ACEExhibitCriteria[];
}> = ({
  industryCertification,
  versionNumber,
  cplType,
  learningMode,
  evidences,
  crs,
}) => (
  <HoverCard>
    <HoverCardTrigger className="cursor-pointer ">
      <li className="flex items-start">
        <span className="mr-[0.5em] flex-shrink-0">-</span>
        <p className="text-sm font-semibold -mt-[0.1em] underline">
          {industryCertification || "N/A"}
          {versionNumber &&
            versionNumber.trim() !== "" &&
            ` Version: ${versionNumber.trim()}`}
        </p>
      </li>
    </HoverCardTrigger>
    <HoverCardContent className="w-[auto]">
      <h3 className="font-bold mb-2">{industryCertification}</h3>
      <p className="text-sm">
        <span className="font-bold">CPL Type : </span>
        {cplType}
      </p>
      <p className="text-sm">
        <span className="font-bold">Learning Mode : </span>
        {learningMode}
      </p>
      <div className={`grid gap-x-4 ${evidences.length > 0 && "grid-cols-2"} `}>
        {crs && crs.length > 0 && (
          <div>
            <p className="font-bold text-sm my-2">Credit Recommendations:</p>
            <ul className="list-disc list-inside ml-4 overflow-y-auto max-h-[350px]">
              {crs.map((cr, crIndex) => (
                <li key={cr.CriteriaID} className="text-sm">
                  <span>{cr.Criteria}</span>{" "}
                  {cr.SkillLevel ?? ` - ${cr.SkillLevel}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        {evidences && evidences.length > 0 && (
          <div>
            <p className="font-bold text-sm my-2">Possible Evidence:</p>
            <ul className="list-disc list-inside ml-4">
              {evidences.map((evidence, evidenceIndex) => (
                <li key={evidence.EvidenceID} className="text-sm">
                  {evidence.EvidenCompetency || "No competency specified"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </HoverCardContent>
  </HoverCard>
);
