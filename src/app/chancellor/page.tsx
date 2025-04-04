"use client";
import { useCallback, useState, useEffect } from "react";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import SearchBar from "@/components/shared/SearchBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createQueryString } from "@/lib/createQueryString";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { DropdownIndustryCertifications } from "@/components/shared/DropdownIndustryCertifications";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import { PotentialSavingsTable } from "@/components/features/chancelor/PotentialSavingsTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileSpreadsheet, Grid, Info, List, Loader2 } from "lucide-react";
import { DropdownColleges } from "@/components/shared/DropdownColleges";
import { DropdownMOS } from "@/components/shared/DropdownMOS";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { collaborativeExhibitsApi } from "@/services/collaborativeExhibits";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { ExhibitCard } from "@/components/features/collaborative/CollabExhibitCard";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { exportCollaborativeExhibits } from "@/lib/events/exportCollaborativeExhibits";
import { toast } from "@/components/ui/use-toast";
import debounce from "lodash/debounce";

export default function Home() {
  const [open, setOpen] = useState("item-1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const [catalogYearId, setCatalogYearId] = useState<string | null>(null);
  const [fetchUrl, setFetchUrl] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const { ref, inView } = useInView();
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isCCCChecked, setIsCCCChecked] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "Not Articulated" | "Articulated" | "Inprogress" | null
  >("Articulated");
  const [isLoadingExhibits, setIsLoadingExhibits] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSetSearchTerm = useCallback(
    (term: string) => {
      if (term.length >= 3 || term.length === 0) {
        setSearchTerm(term);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (term: string) => {
      debounce(debouncedSetSearchTerm, 300)(term);
    },
    [debouncedSetSearchTerm]
  );

  useEffect(() => {
    const newUrl = `/api/cpl-courses?${createQueryString({
      college: selectedCollege ?? undefined,
      industryCertification: selectedIndustryCertification,
      cplType: selectedCPLType ?? undefined,
      learningMode: selectedLearningMode,
      searchTerm: searchTerm.length >= 3 ? searchTerm : undefined,
      excludeColleges: "0,4,5,120,24",
      catalogYearId: catalogYearId ?? undefined,
    })}`;
    setFetchUrl(newUrl);
  }, [
    selectedCollege,
    selectedIndustryCertification,
    selectedCPLType,
    selectedLearningMode,
    searchTerm,
    catalogYearId,
  ]);

  const {
    data: exhibitsResponse,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "collaborativeExhibits",
      {
        ccc: isCCCChecked ? "1" : "0",
        status: selectedStatus,
        searchTerm,
        collegeID: selectedCollege ? parseInt(selectedCollege) : undefined,
        modelOfLearning: selectedLearningMode,
        cplType: selectedCPLType,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      setIsLoadingExhibits(true);
      try {
        return await collaborativeExhibitsApi.getExhibits({
          ccc: isCCCChecked ? "1" : "0",
          status: selectedStatus || undefined,
          searchTerm: searchTerm || undefined,
          modelOfLearning: selectedLearningMode
            ? parseInt(selectedLearningMode)
            : undefined,
          cplType: selectedCPLType ? parseInt(selectedCPLType) : undefined,
          page: pageParam,
          pageSize: 9,
          collegeID: selectedCollege ? parseInt(selectedCollege) : undefined,
        });
      } finally {
        setIsLoadingExhibits(false);
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleCollegeSelect = (collegeId: string | null) => {
    setSelectedCollege(collegeId === "0" ? null : collegeId);
  };
  const handleIndustryCertificationSelect = (
    industryCertification: string | null
  ) => {
    setSelectedIndustryCertification(industryCertification);
  };
  const handleCPLTypeSelect = (cplType: string | null) => {
    setSelectedCPLType(cplType);
  };
  const handleLerningModeSelect = (learningMode: string | null) => {
    setSelectedLearningMode(learningMode);
  };
  const handleMOSSelect = (industryCertification: string | null) => {
    setSelectedIndustryCertification(industryCertification);
  };

  const handleExport = async () => {
    try {
      await exportCollaborativeExhibits(
        isCCCChecked ? "1" : "0",
        selectedStatus,
        searchTerm || null,
        selectedCollege ? parseInt(selectedCollege) : undefined
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleViewModeChange = async (value: string) => {
    if (value) {
      setIsViewLoading(true);
      try {
        if (value === "list") {
          await queryClient.refetchQueries({ queryKey: ["articulations"] });
        } else {
          await queryClient.refetchQueries({
            queryKey: ["collaborativeExhibits"],
          });
        }
        setViewMode(value);
      } finally {
        setIsViewLoading(false);
      }
    }
  };
  const handleCCCChange = async (checked: boolean) => {
    setIsCCCChecked(checked);
    await queryClient.resetQueries({ queryKey: ["collaborativeExhibits"] });
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(
        value as "Not Articulated" | "Articulated" | "Inprogress"
      );
    }
  };
  return (
    <SelectedCoursesProvider>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Accordion
          type="single"
          value={open}
          onValueChange={setOpen}
          collapsible
          className="mt-4 w-full"
        >
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="bg-gray-100 text-black p-4 w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center">
                    <h1 className="text-base sm:text-lg font-medium text-left">
                      Potential CPL Savings & Preservation of Funds (PoF), 20
                      Year-Impact College Metrics
                    </h1>
                    <Info size={16} className="ml-2 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs w-[calc(100vw-32px)] sm:max-w-[500px] font-normal text-left bg-gray-50">
                    <div>
                      <p>
                        Per-Unit Estimated Savings & Preservation of Funds= $965
                        (Working Adult) and $1730 (Military).
                      </p>
                      <p>
                        Per-Unit Estimated 20-Year Impact = $4734 (Working
                        Adult) and $6067 (Military). Assumes AS completion --
                        BS, MS, PhD completion yields significantly higher
                        impact.
                      </p>
                      <p>
                        Savings and Preservation of Funds factors include:
                        Maximum GI Bill tuition or State and Federal Financial
                        Aid; Avg. CA Basic Allowance for Housing (Military);
                        Average College Cost of Living (Working Adult); Textbook
                        Allowance (Military); Saved Apportionment
                      </p>
                      <p>
                        Impact factors include: Increased Earnings (due to
                        credential attainment), Federal & CA Tax Revenues,
                        Productivity & Entrepreneurship; Multiplier Effect—all
                        spread over a 20-year period.
                      </p>
                      <br />
                      <p>
                        <i>
                          *Eligible CPL refers to the units of CPL listed on
                          Student CPL Plans in MAP. These units are approved for
                          use by students, but because student education plans
                          are changeable, decisions to accept CPL or apply
                          alternative CPL may be made at any time. As colleges
                          develop the capacity to accurately record transcribed
                          CPL in MAP and the college Student Information
                          Systems, the dashboard will be revised to reflect
                          transcribed CPL in addition to eligible CPL.
                        </i>
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-white">
              <div className="space-y-4">
                <Card className="hidden">
                  <CardContent className="pt-4 text-sm sm:text-base space-y-4">
                    <p>
                      <strong>
                        Save Time and Money with College Credit for Your Skills
                        and Experience!
                        <br />
                      </strong>
                      You might be able to earn college credit based on what you
                      already know. Check out the list of approved College Prior
                      Learning (CPL) below.
                      <br /> Just enter a keyword to see if you&rsquo;re
                      eligible!
                    </p>
                    <p>
                      <strong>
                        Can&rsquo;t find what you&rsquo;re looking for? No
                        problem!
                      </strong>
                      <br /> You can request a CPL review to see if we can give
                      you credit for your certifications or skills. Here&rsquo;s
                      how to get started:
                    </p>
                    <p className="space-y-2">
                      1. <strong>Apply to the College:</strong>&nbsp;First, go
                      to CCCApply and fill out your application. You&rsquo;ll
                      find the link on the left sidebar.
                      <br /> 2.&nbsp;<strong>Contact a CPL Counselor:</strong>
                      &nbsp;After you&rsquo;ve applied, come back here and click
                      &ldquo;Contact a CPL Counselor&rdquo; to send us an email.
                      <br /> <br /> Provide Your Details: In your email, include
                      your certification details, your work experience, and your
                      CCCApply ID.
                      <br />
                      <strong>
                        We&rsquo;ll review your information and get back to you
                        with the next steps!
                      </strong>
                    </p>
                  </CardContent>
                </Card>
                <div className="w-full overflow-x-auto">
                  <PotentialSavingsTable
                    setSelectedCollege={handleCollegeSelect}
                    onCatalogYearSelect={setCatalogYearId}
                    selectedCatalogYear={catalogYearId}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Card className="w-full">
          <CardHeader className="p-4">
            <CardTitle>
              <div className="flex flex-col md:grid md:grid-cols-3 md:items-center justify-between gap-4 mb-4 text-lg">
                <div className="flex items-center justify-center md:justify-start">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={handleViewModeChange}
                    className="mb-2 sm:mb-0"
                  >
                    <ToggleGroupItem
                      value="grid"
                      aria-label="Grid view"
                      className={viewMode === "grid" ? "shadow-md" : ""}
                      disabled={isViewLoading}
                    >
                      {isViewLoading && viewMode !== "grid" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Grid className="h-4 w-4" />
                          <span>Articulated Exhibits</span>
                        </div>
                      )}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="list"
                      aria-label="List view"
                      className={viewMode === "list" ? "shadow-md" : ""}
                      disabled={isViewLoading}
                    >
                      {isViewLoading && viewMode !== "list" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          <span>Articulated Courses</span>
                        </div>
                      )}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center justify-center">
                  <h3>
                    {viewMode === "grid" ? "Exhibits" : "Courses"}
                  </h3>
                </div>
                <div></div>
              </div>
              <div className="w-full sm:w-auto">
                <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center justify-start gap-2 w-full">
                  {viewMode === "grid" && (
                    <>
                      <Switch
                        id="cccc-filter"
                        checked={isCCCChecked}
                        onCheckedChange={handleCCCChange}
                      />
                      <Label htmlFor="cccc-filter">
                        {isCCCChecked
                          ? "All Recommendations"
                          : "CCC Statewide Recommendations Only"}
                      </Label>
                      <Label htmlFor="status-filter">Status :</Label>
                        <Select
                          value={selectedStatus || "all"}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger
                            id="status-filter"
                            className="w-[180px]"
                          >
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Articulated">
                              Articulated
                            </SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                          </SelectContent>
                        </Select>                      
                    </>
                  )}                    
                  </div>
                  <div className="flex gap-2 items-center justify-end w-full">
                  <SearchBar onSearch={handleSearch} className="w-full sm:w-auto lg:w-64"  />
                  <DropdownColleges
                    onCollegeSelect={handleCollegeSelect}
                    selectedCollege={selectedCollege}
                  />
                  {selectedCollege && selectedCollege !== "0" ? (
                    <DropdownIndustryCertifications
                      onIndustryCertificationSelect={
                        handleIndustryCertificationSelect
                      }
                      collegeId={selectedCollege}
                    />
                  ) : null}
                  <DropdownCPLTypes onCPLTypeSelect={handleCPLTypeSelect} />
                  <DropdownLearningModes
                    onLearningModeSelect={handleLerningModeSelect}
                  />
                  <DropdownMOS onMOSSelect={handleMOSSelect} />
                  {viewMode === "grid" && (
                    <>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleExport}
                          className="w-full sm:w-auto shadow-md"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export to Excel
                        </Button>
                      </div>
                    </>
                  )}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {isLoadingExhibits && !isFetchingNextPage ? (
                  <div className="col-span-full flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : exhibitsResponse?.pages[0]?.data.length === 0 ? (
                  <div className="col-span-full flex justify-center p-4">
                    <div className="text-gray-500">No results found</div>
                  </div>
                ) : (
                  <>
                    {exhibitsResponse?.pages.map((page) =>
                      page.data.map((exhibit: any) => (
                        <ExhibitCard key={exhibit.id} exhibit={exhibit} />
                      ))
                    )}
                    <div
                      ref={ref}
                      className="col-span-full flex justify-center p-4"
                    >
                      {isFetchingNextPage ? (
                        <SkeletonWrapper
                          isLoading={true}
                          fullWidth={true}
                          variant="loading"
                        />
                      ) : hasNextPage ? (
                        <div className="text-gray-500">Scroll to load more</div>
                      ) : (
                        <div className="text-gray-500">
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
                <div className="w-full overflow-x-auto">
                  <ArticulationsTable
                    articulations={[]}
                    loading={false}
                    error={null}
                    searchTerm={searchTerm}
                    showCollegeName={true}
                    CollegeID={
                      selectedCollege ? parseInt(selectedCollege, 10) : 1
                    }
                    settingsObject={null}
                    fetchUrl={fetchUrl}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SelectedCoursesProvider>
  );
}
