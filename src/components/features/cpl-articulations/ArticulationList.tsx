"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewCPLArticulations } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RubricItemsTable } from "@/components/shared/RubricItemsTable";
import { EvidenceCompetenciesTable } from "@/components/shared/EvidenceCompetenciesTable";
import { ExhibitDocumentsTable } from "@/components/shared/ExhibitDocuments";
import { ExhibitArticulatedCoursesTable } from "@/components/shared/ExhibitArticulatedCoursesTable";
import { Badge } from "@/components/ui/badge";

interface ArticulationListProps {
  articulations: ViewCPLArticulations[];
}

export default function ArticulationList({
  articulations,
}: ArticulationListProps) {
  const [selectedExhibitId, setSelectedExhibitId] = useState<string | null>(null);
  const [selectedArticulation, setSelectedArticulation] = useState<ViewCPLArticulations | null>(null);
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead className="font-bold w-10">Actions</TableHead>
            <TableHead className="font-bold">CPL TYpe</TableHead>
            <TableHead className="font-bold">College</TableHead>
            <TableHead className="font-bold">Subject</TableHead>
            <TableHead className="text-center font-bold">
              Course Number
            </TableHead>
            <TableHead className="font-bold">Title</TableHead>
            <TableHead className="text-center font-bold">Credits</TableHead>
            <TableHead className="font-bold">CID Number</TableHead>
            <TableHead className="font-bold">CID Descriptor</TableHead>
            <TableHead className="font-bold">Exhibit ID</TableHead>
            <TableHead className="font-bold">Exhibit Title</TableHead>
            <TableHead className="font-bold">Learning Mode</TableHead>
            <TableHead className="font-bold">Credit Recommendation</TableHead>
            <TableHead className="font-bold">Top Code</TableHead>
            <TableHead className="font-bold">Students</TableHead>
            <TableHead className="font-bold">Units</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articulations.map((articulation, index) => (
            <TableRow key={index}>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    const buttonId = articulation.ArticulationID.toString();
                    setLoadingButtonId(buttonId);
                    // Add small delay to show loading state
                    await new Promise((resolve) => setTimeout(resolve, 1));
                    setSelectedExhibitId(articulation.ExhibitID.toString());
                    setSelectedArticulation(articulation);
                    setLoadingButtonId(null);
                  }}
                  disabled={
                    loadingButtonId === articulation.ArticulationID.toString()
                  }
                >
                  {loadingButtonId ===
                  articulation.ArticulationID.toString() ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  ) : (
                    <SquareArrowOutUpRight className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell>{articulation.CPLTypeDescription}</TableCell>
              <TableCell>{articulation.College}</TableCell>
              <TableCell className="text-center align-top">
                {articulation.Subject}
              </TableCell>
              <TableCell className="text-center align-top">
                {articulation.CourseNumber}
              </TableCell>
              <TableCell className="align-top">
                {articulation.CourseTitle}
              </TableCell>
              <TableCell className="text-center align-top">
                {articulation.Units}
              </TableCell>
              <TableCell>{articulation.CIDNumber}</TableCell>
              <TableCell>{articulation.CIDDescriptor}</TableCell>
              <TableCell>{articulation.AceID}</TableCell>
              <TableCell>{articulation.IndustryCertification}</TableCell>
              <TableCell>{articulation.CPLModeofLearningDescription}</TableCell>
              <TableCell>{articulation.Criteria}</TableCell>
              <TableCell>{articulation.Program_Title}</TableCell>
              <TableCell className="text-center align-top">
                {articulation.Students}
              </TableCell>
              <TableCell className="text-center align-top">
                {articulation.CRUnits?.toString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedExhibitId}
        onOpenChange={() => setSelectedExhibitId(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div>
              Exhibit: {selectedArticulation?.AceID} -{" "}
                {selectedArticulation?.IndustryCertification}{" "}
              </div>

              <div className="pr-8">
                {selectedArticulation && selectedArticulation?.VersionNumber?.toString().trim() !== "" ? (
                  <Badge variant="default">Version : {selectedArticulation?.VersionNumber}</Badge>
                ) : null}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center py-2">     
            <Badge variant="secondary">
              Originating College:{" "}{selectedArticulation?.College}
            </Badge>
          </div>
          {selectedExhibitId && (
            <ExhibitArticulatedCoursesTable
              exhibitId={selectedExhibitId}
              criteriaId={selectedArticulation?.CriteriaID}
              outlineId={selectedArticulation?.OutlineID}
            />
          )}
          {selectedExhibitId && (
            <RubricItemsTable exhibitId={selectedExhibitId} />
          )}
          {selectedExhibitId && (
            <EvidenceCompetenciesTable exhibitId={selectedExhibitId} />
          )}
          {selectedExhibitId && (
            <ExhibitDocumentsTable exhibitId={selectedExhibitId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
