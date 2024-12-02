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
import { File } from "lucide-react";
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

interface ArticulationListProps {
  articulations: ViewCPLArticulations[];
}

export default function ArticulationList({
  articulations,
}: ArticulationListProps) {
  const [selectedExhibitId, setSelectedExhibitId] = useState<string | null>(null);
  const [selectedArticulation, setSelectedArticulation] = useState<ViewCPLArticulations | null>(null);
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
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedExhibitId(articulation.ExhibitID.toString());
                    setSelectedArticulation(articulation);
                  }}
                >
                  <File className="h-4 w-4" />
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
            <DialogTitle>Articulation Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-md">
            <p className="font-semibold">College: {selectedArticulation?.College}</p>
            <p className="font-semibold">Exhibit: {selectedArticulation?.AceID}</p>
            {selectedArticulation?.VersionNumber && (
              <p className="font-semibold">Version: {selectedArticulation?.VersionNumber}</p>
            )}
          </div>
          {selectedExhibitId && (
            <ExhibitArticulatedCoursesTable exhibitId={selectedExhibitId} criteriaId={selectedArticulation?.CriteriaID} outlineId={selectedArticulation?.OutlineID} />
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
