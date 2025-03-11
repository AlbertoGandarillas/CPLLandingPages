"use client";
import { type SearchBarRef } from "@/components/shared/SearchBar";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownImplementedColleges } from "@/components/shared/DropdownImplementedColleges";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { MostCommonCRs } from "@/components/dashboard/MostCommonCRs";
import SearchBar from "@/components/shared/SearchBar";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
import { AlertCircle, FileSpreadsheet, Trash, X } from "lucide-react";
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

interface TopCodeSelection {
  code: string | null;
  title: string | null;
}

export default function InventoryPage() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
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
  const [isCCCChecked, setIsCCCChecked] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "Not Articulated" | "Articulated" | "Inprogress" | null
  >(null);

  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

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
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      return await collaborativeExhibitsApi.getExhibits({
        ccc: isCCCChecked ? "1" : "0",
        status: selectedStatus || undefined,
        searchTerm: searchTerm || undefined,
        page: pageParam,
        pageSize: 9,
        collegeID: selectedCollege ? parseInt(selectedCollege) : undefined,
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
  }, [isCCCChecked, selectedStatus, searchTerm, selectedCollege, queryClient]);

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
              >
                Industry Certifications
              </TabsTrigger>
              <TabsTrigger
                value="topcodes"
                className="text-xs whitespace-nowrap"
              >
                Top Codes
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
                    Most Common Industry Certifications
                  </CardTitle>
                  <CardDescription>
                    Note: List reflects all industry certifications currently in
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
                    Most Common Top Codes
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
        <div className="flex items-center justify-between gap-4 mb-4 ">
          <div className="flex items-center space-x-4">
            <SearchBar
              ref={searchBarRef}
              onSearch={handleSearch}
              placeholder="Search..."
              className="w-full sm:w-auto lg:w-96"
            />
            <DropdownColleges
              onCollegeSelect={setSelectedCollege}
              selectedCollege={selectedCollege}
            />
            <Switch
              id="cccc-filter"
              checked={isCCCChecked}
              onCheckedChange={handleCCCChange}
            />
            <Label htmlFor="cccc-filter">
              CCCC State Wide Credit Recommendations
            </Label>
          </div>

          <div className="flex gap-2 w-[400px] items-center">
            <Label htmlFor="status-filter">Articulation Status :</Label>
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
                <SelectItem value="Inprogress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            className="whitespace-nowrap"
          >
            <Trash className="h-4 w-4" /> Clear Filters
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExport}
            className="w-full sm:w-auto"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {exhibitsResponse?.pages.map((page) =>
            page.data.map((exhibit: any) => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))
          )}
          <div ref={ref} className="col-span-full flex justify-center p-4">
            {isFetchingNextPage ? (
              <SkeletonWrapper
                isLoading={true}
                fullWidth={true}
                variant="loading"
              />
            ) : hasNextPage ? (
              <div className="text-gray-500">Scroll to load more</div>
            ) : (
              <div className="text-gray-500">No more exhibits to load</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
