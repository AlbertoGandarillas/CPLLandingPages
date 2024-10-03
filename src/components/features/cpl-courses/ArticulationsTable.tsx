import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Mails } from "lucide-react";
import { ViewCPLCreditRecommendations } from "@prisma/client";
import {
  ViewCPLCourses,
  ViewCPLEvidenceCompetency,
  ViewCPLIndustryCertifications,
} from "@prisma/client";
import { ArticulationExport } from "@/types/ArticulationExport";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "./ArticulationsHeader";
import ArticulationCard from "./ArticulationCard";
import ArticulationList from "./ArticulationList";
import CPLRequestModal from "./CPLRequestModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              ${ic.CPLTypeDescription}
              ${ic.CPLModeofLearningDescription}
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

  const { selectedCourses } = useSelectedCourses();

  const handleCPLRequestSubmit = async (name: string, email: string) => {
    try {
      const response = await fetch("/api/send-cpl-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          selectedCourses: selectedCourses.map((id) => {
            const course = articulations.find(
              (a) => a.OutlineID.toString() === id
            );
            return course
              ? `${course.Subject} ${course.CourseNumber}: ${course.CourseTitle}`
              : "";
          }),
          CPLAssistantEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast({
        title: "Request Sent",
        description: `Your CPL information request has been sent to ${CPLAssistantEmail}.`,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send your request. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCPLRequestDBSubmit = async (
    firstName: string,
    lastName: string,
    email: string,
    hasCCCApplyId: boolean,
    cccApplyId: string | null
  ) => {
    try {
      const response = await fetch("/api/cpl-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          hasCCCApplyId,
          cccApplyId,
          selectedCourses: selectedCourses.map((id) => {
            const course = articulations.find(
              (a) => a.OutlineID.toString() === id
            );
            return course
              ? `${course.Subject} ${course.CourseNumber}: ${course.CourseTitle}`
              : "";
          }),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle successful submission
      toast({
        title: "Request Submitted",
        description:
          "Your CPL information request has been submitted successfully.",
        variant: "success",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
      // The modal will remain open, and the form will not be cleared
    }
  };

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={() => exportToExcel(filteredItems, "EligibleCourses")}
        >
          <div className="hidden">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={selectedCourses.length === 0}
              >
                <Mails className="mr-2" />
                Request CPL Information ({selectedCourses.length})
              </Button>
            </div>
          </div>
          {children}
        </ArticulationHeader>
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
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                {!loading &&
                  !error &&
                  filteredItems.map((articulation) => (
                    <ArticulationCard
                      key={articulation.OutlineID}
                      articulation={articulation}
                      showCollegeName={showCollegeName}
                    />
                  ))}
              </div>
            ) : (
              <ArticulationList
                articulations={filteredItems}
                showCollegeName={showCollegeName}
              />
            )}
          </SkeletonWrapper>
        )}
        <CPLRequestModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedCourses={selectedCourses}
          courses={articulations}
          onSubmit={handleCPLRequestDBSubmit}
        />
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
        "Credit Recommendations": articulation.IndustryCertifications?.flatMap(
          (ic) => ic.CreditRecommendations?.map((e) => e.Criteria) ?? []
        ).join(", "),
        "Required Evidence": articulation.IndustryCertifications?.flatMap(
          (ic) => ic.Evidences?.map((e) => e.EvidenCompetency) ?? []
        ).join(", "),
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Eligible Courses Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
