import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Mails } from "lucide-react";
import { ArticulationExport } from "@/types/ArticulationExport";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "./ArticulationsHeader";
import ArticulationCard from "./ArticulationCard";
import ArticulationList from "./ArticulationList";
import CPLRequestModal from "./CPLRequestModal";
import { Button } from "@/components/ui/button";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { ContactForm } from "@/components/shared/ContactForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import LoadMore from "@/components/shared/LoadMore";
import LoadMoreButton from "@/components/shared/LoadMore";

interface ArticulationsTableProps {
  articulations: ExtendedViewCPLCourses[];
  loading: boolean;
  error?: Error | null;
  searchTerm: string;
  CPLAssistantEmail?: string;
  showCollegeName?: boolean;
  children?: React.ReactNode;
  CollegeID: number;
  settingsObject: {
    CompBackgroundColor: string;
    CompFontColor: string;
    PanelBackgroundColor: string;
    PanelFontColor: string;
  } | null;
  fetchUrl?: string;
}

export default function ArticulationsTable({
  articulations: initialArticulations,
  loading: initialLoading,
  error: initialError,
  CPLAssistantEmail,
  showCollegeName,
  children,
  CollegeID,
  settingsObject,
  fetchUrl,
}: ArticulationsTableProps) {
  const [selectedArticulation, setSelectedArticulation] = 
    useState<ExtendedViewCPLCourses | null>(null);
  const [viewMode, setViewMode] = React.useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMore,
    error: infiniteError,
  } = useInfiniteQuery({
    queryKey: ["infiniteArticulations", fetchUrl],
    enabled: !!fetchUrl,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`${fetchUrl}&page=${pageParam}&limit=20`);
      if (!res.ok) {
        if (res.status === 404) {
          return {
            data: [] as ExtendedViewCPLCourses[],
            metadata: {
              hasMore: false,
              currentPage: pageParam as number,
              totalCount: 0,
              pageSize: 20,
              totalPages: 0,
            },
          } as PaginatedResponse;
        }
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return {
        data: data as ExtendedViewCPLCourses[],
        metadata: {
          hasMore: data.length === 20,
          currentPage: pageParam as number,
          totalCount: data.length,
          pageSize: 20,
          totalPages: Math.ceil(data.length / 20),
        },
      } as PaginatedResponse;
    },
    getNextPageParam: (lastPage: PaginatedResponse) => {
      if (!lastPage.metadata.hasMore) return undefined;
      return lastPage.metadata.currentPage + 1;
    },
  });

  const allArticulations = infiniteData?.pages.flatMap((page) => page.data) ?? initialArticulations;

  const isLoading = initialLoading || isLoadingMore;
  const error = infiniteError || initialError;
  const isEmpty = allArticulations.length === 0 && !isLoading && !error;

  const hasMilitaryCPLType = (articulation: ExtendedViewCPLCourses) => {
    return articulation.IndustryCertifications?.some(
      (cert) => cert.CPLTypeDescription === "Military"
    );
  };

  const { getSelectedCoursesForCollege } = useSelectedCourses();
  const collegeSelectedCourses = getSelectedCoursesForCollege(
    CollegeID.toString()
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={() => exportToExcel(allArticulations, "EligibleCourses")}
        >
          {CollegeID && CPLAssistantEmail && (
            <Button
              style={{
                backgroundColor: settingsObject?.CompBackgroundColor,
                color: settingsObject?.CompFontColor,
              }}
              onClick={() => {
                collegeSelectedCourses.length === 0
                  ? setIsInquiryModalOpen(true)
                  : setIsModalOpen(true);
              }}
              disabled={!CPLAssistantEmail}
            >
              <Mails className="mr-2" />
              Request CPL Review{" "}
              {collegeSelectedCourses.length > 0
                ? "( " + collegeSelectedCourses.length + " )"
                : ""}
            </Button>
          )}
          <div></div>
          {children}
        </ArticulationHeader>
        {error && <p>Error: {error.message}</p>}
        {isEmpty ? (
          <p className="text-center text-xl p-4 sm:p-10 w-full sm:w-1/2 m-auto">
            {CPLAssistantEmail ? (
              <>
                If you have prior learning experience that you feel would
                qualify for CPL, but you don&apos;t see the discipline or course
                in our list, please email{" "}
                <a href={`mailto:${CPLAssistantEmail}`}>{CPLAssistantEmail}</a>
              </>
            ) : (
              <>
                There are no existing articulated courses for the selected
                criteria.
              </>
            )}
          </p>
        ) : (
          <SkeletonWrapper
            isLoading={isLoading}
            fullWidth={true}
            variant="table"
          >
            {viewMode === "grid" ? (
              <>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 overflow-y-auto max-h-svh">
                  {!isLoading &&
                    !error &&
                    allArticulations.map(
                      (articulation: ExtendedViewCPLCourses) => (
                        <>
                          <ArticulationCard
                            key={articulation.OutlineID}
                            articulation={articulation}
                            showCollegeName={showCollegeName}
                            showFavoriteStar={CollegeID ? true : false}
                            CardBackgroundColor={
                              settingsObject?.PanelBackgroundColor
                            }
                            CardFontColor={settingsObject?.PanelFontColor}
                            PrimaryBackgroundColor={
                              settingsObject?.CompBackgroundColor
                            }
                            PrimaryFontColor={settingsObject?.CompFontColor}
                            collegeId={CollegeID ? CollegeID.toString() : ""}
                            CPLAssistantEmail={CPLAssistantEmail}
                          />
                        </>
                      )
                    )}
                </div>
                {hasNextPage && (
                  <LoadMoreButton
                    onClick={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                    className="mt-6"
                  />
                )}
              </>
            ) : (
              <>
                <ArticulationList
                  articulations={allArticulations}
                  showCollegeName={showCollegeName}
                  PrimaryBackgroundColor={settingsObject?.CompBackgroundColor}
                  collegeId={CollegeID ? CollegeID.toString() : ""}
                  CPLAssistantEmail={CPLAssistantEmail || ""}
                />
                {hasNextPage && (
                  <LoadMoreButton
                    onClick={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </SkeletonWrapper>
        )}

        <CPLRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCourses={collegeSelectedCourses}
          courses={allArticulations}
          CPLAssistantEmail={CPLAssistantEmail || ""}
          CollegeID={CollegeID ? CollegeID.toString() : undefined}
        />
        <ContactForm
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          CPLAssistantEmail={CPLAssistantEmail || ""}
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
        "Suggested Evidence": articulation.IndustryCertifications?.flatMap(
          (ic) => ic.Evidences?.map((e) => e.EvidenCompetency) ?? []
        ).join(", "),
      })
    )
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Eligible Courses Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
