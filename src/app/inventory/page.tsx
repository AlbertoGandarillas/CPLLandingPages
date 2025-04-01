"use client";
import { type SearchBarRef } from "@/components/shared/SearchBar";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { MostCommonCRs } from "@/components/dashboard/MostCommonCRs";
import SearchBar from "@/components/shared/SearchBar";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MostCommonTopCodes } from "@/components/dashboard/MostCommonTopCodes";
import { MostCommonCIDs } from "@/components/dashboard/MostCommonCIDs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  FileSpreadsheet,
  Grid,
  List,
  Trash,
  Loader2,
  X,
  Filter,
} from "lucide-react";
import { PotentialSavingsTable } from "@/components/features/chancelor/PotentialSavingsTable";
import { Button } from "@/components/ui/button";
import { MostCommonIndCertifications } from "@/components/dashboard/MostCommonIndCertifications";
import { collaborativeExhibitsApi } from "@/services/collaborativeExhibits";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExhibitCard } from "@/components/features/collaborative/CollabExhibitCard";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { DropdownColleges } from "@/components/shared/DropdownColleges";
import { exportCollaborativeExhibits } from "@/lib/events/exportCollaborativeExhibits";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createQueryString } from "@/lib/createQueryStringArticulations";
import ArticulationsTable from "@/components/features/cpl-articulations/ArticulationsTable";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/lib/events/exportUtils";
import React from "react";
import { Badge } from "@/components/ui/badge";
interface TopCodeSelection {
  code: string | null;
  title: string | null;
}

export default function InventoryPage() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedCollegeName, setSelectedCollegeName] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [selectedCR, setSelectedCR] = useState<string | null>(null);
  const [selectedIndCert, setSelectedIndCert] = useState<string | null>(null);
  const [selectedTopCode, setSelectedTopCode] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedCIDNumber, setSelectedCIDNumber] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchBarRef = useRef<SearchBarRef>(null);
  const [selectedCatalogYear, setSelectedCatalogYear] = useState<string | null>(
    null
  );
  const [isCCCChecked, setIsCCCChecked] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "Not Articulated" | "Articulated" | "Inprogress" | null
  >("Articulated");
  const [viewMode, setViewMode] = useState("grid");
  const { ref, inView } = useInView();
  const [isViewLoading, setIsViewLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: articulations,
    error: articulationsError,
    isLoading: articulationsIsLoading,
  } = useQuery({
    queryKey: [
      "articulations",
      selectedCollege,
      selectedCPLType,
      selectedLearningMode,
      selectedCR,
      selectedTopCode,
      selectedCIDNumber,
      searchTerm,
      selectedIndCert,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/cpl-articulations?${createQueryString({
          college: selectedCollege ?? undefined,
          cplType: selectedCPLType ?? undefined,
          learningMode: selectedLearningMode,
          criteria: selectedCR ?? undefined,
          topCode: selectedTopCode ?? undefined,
          cidNumber: selectedCIDNumber ?? undefined,
          searchTerm: searchTerm.length >= 3 ? searchTerm : undefined,
          indCert: selectedIndCert ?? undefined,
          excludeColleges: "0,4,5,120,24",
        })}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    },
  });

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
        creditRecommendation: selectedCR || undefined,
        industryCert: selectedIndCert || undefined,
        topCode: selectedTopCode || undefined,
        cidNumber: selectedCIDNumber || undefined,
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await collaborativeExhibitsApi.getExhibits({
        ccc: isCCCChecked ? "1" : "0",
        status: selectedStatus || undefined,
        searchTerm: searchTerm || undefined,
        modelOfLearning: selectedLearningMode
          ? parseInt(selectedLearningMode)
          : undefined,
        cplType: selectedCPLType ? parseInt(selectedCPLType) : undefined,
        creditRecommendation: selectedCR || undefined,
        industryCert: selectedIndCert || undefined,
        page: pageParam,
        pageSize: 9,
        collegeID: selectedCollege ? parseInt(selectedCollege) : undefined,
        topCode: selectedTopCode || undefined,
        cidNumber: selectedCIDNumber || undefined,
        });
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

  const handleCatalogYearSelect = useCallback((yearId: string | null) => {
    console.log("Page - Selected Year:", yearId);
    setSelectedCatalogYear(yearId);
  }, []);

  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);

  const handleCollegeSelect = (collegeId: string | null) => {
    setSelectedCollege(collegeId);
  };
  const handleLerningModeSelect = (learningModeId: string | null) => {
    setSelectedLearningMode(learningModeId);
  };
  const handleCPLTypeSelect = (cplTypeId: string | null) => {
    setSelectedCPLType(cplTypeId);
  };
  const handleCRSelect = (criteria: string | null) => {
    setSelectedCR(criteria);
  };
  const handleIndCertSelect = (indCert: string | null) => {
    setSelectedIndCert(indCert);
  };
  const handleTopCodeSelect = (selection: TopCodeSelection) => {
    setSelectedTopCode(selection.code);
    setSelectedProgram(selection.title);
  };
  const handleCIDNumberSelect = (cidNumber: string | null) => {
    setSelectedCIDNumber(cidNumber);
  };

  const handleClearFilters = async () => {
    setSelectedCollege(null);
    setSelectedLearningMode(null);
    setSelectedCPLType(null);
    setSelectedCR(null);
    setSelectedTopCode(null);
    setSelectedCIDNumber(null);
    setSelectedIndCert(null);
    setSearchTerm("");
    searchBarRef.current?.clear();
    setSelectedCatalogYear(null);
    setSelectedStatus(null);
    setIsCCCChecked(true);
    await queryClient.resetQueries({ queryKey: ["collaborativeExhibits"] });
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

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["collaborativeExhibits"] });
  }, [isCCCChecked, selectedStatus, searchTerm, selectedCollege, selectedCR, selectedIndCert, selectedTopCode, selectedCIDNumber, queryClient]);

  const handleExport = async () => {
    try {
      if (viewMode === "list") {
        if (articulations) {
          exportToExcel(articulations, "Articulations");
        }
      } else {
        await exportCollaborativeExhibits(
          isCCCChecked ? "1" : "0",
          selectedStatus,
          searchTerm || null,
          selectedCollege ? parseInt(selectedCollege) : undefined
        );
      }
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

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:min-w-0 lg:flex-1">
          <div className="mb-4"></div>
          <PotentialSavingsTable
            hideCPLImpactChart={true}
            setSelectedCollege={handleCollegeSelect}
            onCatalogYearSelect={setSelectedCatalogYear}
            selectedCatalogYear={selectedCatalogYear}
          />
        </div>
        <div className="w-full lg:w-[550px] lg:flex-none">
          <Tabs defaultValue="crs" className="w-full">
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="crs" className="text-xs whitespace-nowrap">
                Credit Recommendations
              </TabsTrigger>
              <TabsTrigger
                value="industry"
                className="text-xs whitespace-nowrap"
                title="CPL Exhibits are collections of Credit Recommendations, either from ACE in the case of Military CPL or MAP for all other CPL"
              >
                CPL Exhibits
              </TabsTrigger>
              <TabsTrigger
                value="topcodes"
                className="text-xs whitespace-nowrap"
              >
                TOP Codes
              </TabsTrigger>
              <TabsTrigger value="cids" className="text-xs whitespace-nowrap">
                C-ID Numbers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="crs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Most Common Credit Recommendations
                  </CardTitle>
                  <CardDescription>
                    Note: List reflects all credit recommendations currently in
                    MAP. Not all are articulated with a course at a
                    college...yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MostCommonCRs
                    onSelect={handleCRSelect}
                    catalogYearId={selectedCatalogYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="industry">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Most Common CPL Exhibits
                  </CardTitle>
                  <CardDescription>
                    Note: List reflects all CPL Exhibits currently in
                    MAP. Not all are articulated with a course at a
                    college...yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MostCommonIndCertifications
                    onSelect={handleIndCertSelect}
                    creditRecommendation={selectedCR}
                    catalogYearId={selectedCatalogYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="topcodes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Most Common TOP Codes
                  </CardTitle>
                  <CardDescription>
                    Note: List reflects all Course TOP codes with an associated
                    credit recommendation currently in MAP. Not all are credit
                    recommendations are associated with a local college
                    course...yet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <MostCommonTopCodes
                    onSelect={handleTopCodeSelect}
                    catalogYearId={selectedCatalogYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cids">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Most Common C-ID Numbers
                  </CardTitle>
                  <CardDescription>
                    Note: List reflects all Course Identification Numbering
                    System (C-ID) with an articulated credit recommendation
                    currently in MAP. Note that not all college courses are
                    associated with a C-ID.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <MostCommonCIDs
                    onSelect={handleCIDNumberSelect}
                    catalogYearId={selectedCatalogYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            {(selectedCollege || selectedCatalogYear || selectedCR || selectedIndCert || selectedProgram || selectedCIDNumber ) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><p>Selected Filters</p><Filter className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {selectedCollege && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  {selectedCollege}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCollege(null)} />
                </Badge>
                )}
                {selectedCatalogYear && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {selectedCatalogYear}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCatalogYear(null)} />
                  </Badge>
                )}
                {selectedCR && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {selectedCR}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCR(null)} />
                  </Badge>
                )}
                {selectedIndCert && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {selectedIndCert}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedIndCert(null)} />
                  </Badge>
                )}
                  {selectedProgram && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {selectedProgram}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedProgram(null)} />
                  </Badge>
                )}
                {selectedCIDNumber && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {selectedCIDNumber}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCIDNumber(null)} />
                  </Badge>
                )}         
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </AlertDescription>
          </Alert>
        )}
        <Card className="w-full">
          <CardHeader className="bg-muted p-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-4">
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
            </CardTitle>
            <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3 mb-4">
              {viewMode === "grid" && (
                <div className="flex items-center justify-center gap-2 w-full">
                  <>
                    <Switch
                      id="cccc-filter"
                      checked={isCCCChecked}
                      onCheckedChange={handleCCCChange}
                    />
                    <Label htmlFor="cccc-filter">
                      {isCCCChecked
                        ? "CCC Statewide Recommendations Only"
                        : "All Recommendations"}
                    </Label>
                    <Label htmlFor="status-filter">Status :</Label>
                    <Select
                      value={selectedStatus || "all"}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger id="status-filter" className="w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Articulated">Articulated</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                </div>
              )}
              <div className="flex gap-2 items-center justify-center w-full">
                <SearchBar
                  ref={searchBarRef}
                  onSearch={handleSearch}
                  placeholder="Search..."
                  inputClassName="bg-blue-100"
                  className="w-full sm:w-auto lg:w-64"
                />
                <DropdownColleges
                  onCollegeSelect={setSelectedCollege}
                  selectedCollege={selectedCollege}

                />
                <DropdownLearningModes
                  onLearningModeSelect={setSelectedLearningMode}
                  selectedMode={selectedLearningMode}
                />
                <DropdownCPLTypes
                  onCPLTypeSelect={setSelectedCPLType}
                  selectedType={selectedCPLType}
                />
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="whitespace-nowrap shadow-md"
                >
                  <Trash className="h-4 w-4" /> Clear Filters
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExport}
                  className="w-full sm:w-auto shadow-md"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-3">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {exhibitsResponse?.pages[0]?.data.length === 0 ? (
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
                          No more exhibits to load
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <ArticulationsTable
                loading={articulationsIsLoading}
                error={articulationsError}
                searchTerm={searchTerm}
                CollegeID={selectedCollege ? parseInt(selectedCollege, 10) : 1}
                articulations={articulations}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
