"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
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
  const [selectedExhibitId, setSelectedExhibitId] = useState<string | null>(
    null
  );
  const [selectedArticulation, setSelectedArticulation] =
    useState<ViewCPLArticulations | null>(null);
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  const [displayedArticulations, setDisplayedArticulations] = useState<
    ViewCPLArticulations[]
  >([]);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  const itemsPerPage = 20;

  useEffect(() => {
    setDisplayedArticulations(articulations.slice(0, itemsPerPage));
  }, [articulations]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextItems = articulations.slice(
            page * itemsPerPage,
            (page + 1) * itemsPerPage
          );
          if (nextItems.length > 0) {
            setDisplayedArticulations((prev) => [...prev, ...nextItems]);
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.1 }
    );

    // Store the current value of the ref in a variable
    const currentLoadingRef = loadingRef.current;

    // Use the stored variable in both observe and cleanup
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      // Use the same stored variable in cleanup
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [page, articulations, itemsPerPage]); // Add itemsPerPage to dependencies

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "80px",
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Details
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                CPL Type
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                College
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Subject
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Course Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Credits
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                CID Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                CID Descriptor
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Exhibit ID
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Exhibit Title
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Version
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Learning Mode
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Credit Recommendation
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Skill Level
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                TOP Code
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Students
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Units
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedArticulations.map((articulation, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      const buttonId = articulation.ArticulationID.toString();
                      setLoadingButtonId(buttonId);
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
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CPLTypeDescription}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.College}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.Subject}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CourseNumber}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CourseTitle}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.Units}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CIDNumber}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CIDDescriptor}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.AceID}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.IndustryCertification}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.VersionNumber}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CPLModeofLearningDescription}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.Criteria}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.SkillLevel}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.Program_Title}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.Students}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontSize: "12px", fontFamily: "var(--font-sans)" }}
                >
                  {articulation.CRUnits?.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div ref={loadingRef} style={{ height: "20px" }} />
      </TableContainer>

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
                {selectedArticulation &&
                selectedArticulation?.VersionNumber?.toString().trim() !==
                  "" ? (
                  <Badge variant="default">
                    Version : {selectedArticulation?.VersionNumber}
                  </Badge>
                ) : null}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center py-2">
            <Badge variant="secondary">
              Originating College: {selectedArticulation?.College}
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
