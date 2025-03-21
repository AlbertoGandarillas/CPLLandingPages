import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Mails } from "lucide-react";
import SkeletonWrapper from "../../shared/SkeletonWrapper";
import ArticulationHeader from "./ArticulationsHeader";
import ArticulationCard from "./ArticulationCard";
import ArticulationList from "./ArticulationList";
import CPLRequestModal from "./CPLRequestModal";
import { Button } from "@/components/ui/button";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { ViewCPLCoursesExport } from "@prisma/client";
import { ContactForm } from "@/components/shared/ContactForm";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { toast } from "@/components/ui/use-toast";

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
  columnsToHide?: string[];
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
  columnsToHide,
}: ArticulationsTableProps) {
  const [selectedArticulation, setSelectedArticulation] =
    useState<ExtendedViewCPLCourses | null>(null);
  const [viewMode, setViewMode] = React.useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(18);
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
      const res = await fetch(`${fetchUrl}&page=${pageParam}&limit=${pageSize}`);
      if (!res.ok) {
        if (res.status === 404) {
          return {
            data: [] as ExtendedViewCPLCourses[],
            metadata: {
              hasMore: false,
              currentPage: pageParam as number,
              totalCount: 0,
              pageSize: pageSize,
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
          hasMore: data.length === pageSize,
          currentPage: pageParam as number,
          totalCount: data.length,
          pageSize: pageSize,
          totalPages: Math.ceil(data.length / pageSize),
        },
      } as PaginatedResponse;
    },
    getNextPageParam: (lastPage: PaginatedResponse) => {
      if (!lastPage.metadata.hasMore) return undefined;
      return lastPage.metadata.currentPage + 1;
    },
  });

  const allArticulations =
    infiniteData?.pages.flatMap((page) => page.data) ?? initialArticulations;

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

  const handleExport = async () => {
    try {
      if (fetchUrl) {
        const baseUrl = fetchUrl.split("?")[0];
        const params = new URLSearchParams(fetchUrl.split("?")[1]);
        params.append("export", "true");

        const res = await fetch(`${baseUrl}?${params.toString()}`);
        if (!res.ok) throw new Error("Export failed");

        const allData = await res.json();
        exportToExcel(allData, "EligibleCourses", columnsToHide);
      } else {
        exportToExcel(allArticulations, "EligibleCourses", columnsToHide);
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export to Excel",
        description: `Please adjust your search criteria to narrow down the results.`,
        variant: "destructive",
      });
      return;
    }
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <ArticulationHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
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
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                  {!isLoading &&
                    !error &&
                    allArticulations.map(
                      (articulation: ExtendedViewCPLCourses) => (
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
                      )
                    )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ArticulationList
                  articulations={allArticulations}
                  showCollegeName={showCollegeName}
                  PrimaryBackgroundColor={settingsObject?.CompBackgroundColor}
                  collegeId={CollegeID ? CollegeID.toString() : ""}
                  CPLAssistantEmail={CPLAssistantEmail || ""}
                />
              </div>
            )}

            {!isLoading && !error && allArticulations.length > 0 && (
              <>
                <div ref={observerTarget} className="h-20 w-full mt-4" />
                {isFetchingNextPage && (
                  <div className="mt-4">
                    <SkeletonWrapper
                      isLoading={true}
                      fullWidth={true}
                      variant="loading"
                    />
                  </div>
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
  articulations: ExtendedViewCPLCourses[] | ViewCPLCoursesExport[],
  fileName: string,
  columnsToHide?: string[]
): void => {
  const flattenedRows = articulations.flatMap((articulation) => {
    if ("SuggestedEvidence" in articulation) {
      const creditRecommendations = (
        articulation.CreditRecommendations ?? ""
      ).split("|");

      const fullRow = {
        "Exhibit ID": articulation.AceID ?? "",
        "Possible Qualifications": articulation.IndustryCertification ?? "",
        "CPL Type": articulation.CPLTypeDescription ?? "",
        "CPL Mode": articulation.CPLModeofLearningDescription ?? "",
        "Credit Recommendation": "",
        College: articulation.College ?? "",
        Subject: articulation.Subject ?? "",
        "Course Number": articulation.CourseNumber ?? "",
        "Course Title": articulation.Course ?? "",
        Units: articulation.Units ?? "",
        "Suggested Evidence":
          articulation.CPLTypeDescription === "Military" &&
          !articulation.SuggestedEvidence
            ? "JST"
            : (articulation.SuggestedEvidence ?? "").replace(/\|/g, ", "),
      };

      return creditRecommendations.map((recommendation) => {
        const row = {
          ...fullRow,
          "Credit Recommendation": recommendation.trim(),
        };
        return columnsToHide?.length
          ? Object.fromEntries(
              Object.entries(row).filter(
                ([key]) => !columnsToHide.includes(key)
              )
            )
          : row;
      });
    }
    return [];
  });

  const ws = XLSX.utils.json_to_sheet(flattenedRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Eligible Courses Sheet");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
