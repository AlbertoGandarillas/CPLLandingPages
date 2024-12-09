"use client";
import { type SearchBarRef } from "@/components/shared/SearchBar";
import ArticulationsTable from "@/components/features/cpl-articulations/ArticulationsTable";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownImplementedColleges } from "@/components/shared/DropdownImplementedColleges";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { MostCommonCRs } from "@/components/dashboard/MostCommonCRs";
import SearchBar from "@/components/shared/SearchBar";
import { createQueryString } from "@/lib/createQueryStringArticulations";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState, useRef } from "react";
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
import { AlertCircle, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PotentialSavingsTable } from "@/components/features/chancelor/PotentialSavingsTable";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [selectedCR, setSelectedCR] = useState<string | null>(null);
  const [selectedTopCode, setSelectedTopCode] = useState<string | null>(null);
  const [selectedCIDNumber, setSelectedCIDNumber] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchBarRef = useRef<SearchBarRef>(null);

  const {
    data: articulations,
    error,
    isLoading,
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
  const handleTopCodeSelect = (topCode: string | null) => {
    setSelectedTopCode(topCode);
  };
  const handleCIDNumberSelect = (cidNumber: string | null) => {
    setSelectedCIDNumber(cidNumber);
  };

  const handleClearFilters = () => {
    setSelectedCollege(null);
    setSelectedLearningMode(null);
    setSelectedCPLType(null);
    setSelectedCR(null);
    setSelectedTopCode(null);
    setSelectedCIDNumber(null);
    setSearchTerm("");
    searchBarRef.current?.clear();
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:min-w-0 lg:flex-1">
          <PotentialSavingsTable
            hideCPLImpactChart={true}
            setSelectedCollege={handleCollegeSelect}
          />
        </div>
        <div className="w-full lg:w-[450px] lg:flex-none">
          <Tabs defaultValue="crs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crs" className="text-xs">
                Credit Recommendations
              </TabsTrigger>
              <TabsTrigger value="topcodes" className="text-xs">
                Top Codes
              </TabsTrigger>
              <TabsTrigger value="cids" className="text-xs">
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
                  <MostCommonCRs onSelect={handleCRSelect} />
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
                  <MostCommonTopCodes onSelect={handleTopCodeSelect} />
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
                  <MostCommonCIDs onSelect={handleCIDNumberSelect} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="mt-4">
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
        <ArticulationsTable
          loading={isLoading}
          error={error}
          searchTerm={searchTerm}
          CollegeID={selectedCollege ? parseInt(selectedCollege, 10) : 1}
          articulations={articulations}
        >
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 w-full">
            <SearchBar
              ref={searchBarRef}
              onSearch={handleSearch}
              placeholder="Search..."
              className="w-full sm:w-auto lg:w-96"
            />
            <DropdownImplementedColleges
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
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCR && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCR}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCRSelect(null)}
                  />
                </Badge>
              )}
              {selectedCIDNumber && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCIDNumber}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCIDNumberSelect(null)}
                  />
                </Badge>
              )}
              {selectedTopCode && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedTopCode}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleTopCodeSelect(null)}
                  />
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="whitespace-nowrap"
            >
              <Trash className="h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </ArticulationsTable>
      </div>
    </div>
  );
}
