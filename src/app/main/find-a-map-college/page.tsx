"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFindColleges } from "@/hooks/useFindColleges";
import { LookupColleges, ViewCPLCertificationsByCollege } from "@prisma/client";
import SearchBar from "@/components/shared/SearchBar";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import { useCallback, useEffect, useState } from "react";
import { createQueryString } from "@/lib/createQueryString";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useIntroJS } from "@/hooks/useIntroJS";
// Dynamically import the map component with SSR disabled
const CollegeMap = dynamic(() => import("@/components/portal/CollegeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  ),
});

export default function FindAMapCollege() {
  useIntroJS({
    steps: [
      {
        title: "Search for Colleges",
        element: '[data-intro="search-colleges"]',
        intro:
          "Use the search to find colleges in your area. To see specific opportunities at a college or to request a CPL review from a college, click the icon to view that colleges CPL page. To view some opportunities on this page, click the college name to filter the table of CPL Opportunities at the bottom of the page.",
        position: "bottom",
      },
      {
        title: "View Colleges on the Map",
        element: '[data-intro="view-colleges-on-map"]',
        intro:
          "Click and drag to move positions on the map, click on pins to see the college name and their top CPL offerings.",
        position: "left",
      },
      {
        title: "Browse Courses",
        element: '[data-intro="browse-courses"]',
        intro:
          "View some common CPL offerings in this table. You can filter the table by clicking the college name from the College Finder list, or search by keyword in the search bar.",
        position: "right",
      },
    ],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const { data, isLoading, error } = useFindColleges(true); // Always pass true to ignore paging

  const filteredColleges = React.useMemo(() => {
    if (!data) return [];
    // Check if data is an array directly or has items property
    const collegesArray = Array.isArray(data) ? data : data.items;
    if (!collegesArray) return [];
    
    return collegesArray.filter(
      (college: LookupColleges & { CollegeUIConfig: { Slug: string | null }[] } & { CertificationsByCollege: ViewCPLCertificationsByCollege[] }) =>
        college.College.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.City?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.ZipCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.StateCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const fetchUrl = `/api/cpl-courses?${createQueryString({
    college: selectedCollege?.toString() ?? undefined,
    searchTerm: searchTerm.length >= 3 ? searchTerm : undefined,
  })}`;

  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    setSearchTerm("");
    setSelectedCollege(null);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading colleges: {error.message}</div>;
  }

  return (
    <SelectedCoursesProvider>
      <div className="w-full mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Find CPL Opportunities at California Community Colleges
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1" data-intro="search-colleges">
            <CardHeader>
              <CardTitle>College Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchBar
                onSearch={(term) => setSearchQuery(term)}
                onClear={handleSearchClear}
                placeholder="Search colleges by name, city, or zip code..."
                className="mb-4"
              />
              <ScrollArea className="h-[500px]">
                {filteredColleges.map(
                  (
                    college: LookupColleges & {
                      CollegeUIConfig: { Slug: string | null }[];
                    }
                  ) => (
                    <div
                      key={college.CollegeID}
                      className="flex justify-between items-center"
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left mb-2 ${
                          selectedCollege === college.CollegeID
                            ? "bg-muted"
                            : ""
                        }`}
                        onClick={() => setSelectedCollege(college.CollegeID)}
                      >
                        <div>
                          <div className="font-semibold">{college.College}</div>
                          <div className="text-sm text-muted-foreground">
                            {college.City}, {college.StateCode}{" "}
                            {college.ZipCode}
                          </div>
                        </div>
                      </Button>
                      <Link
                        target="_blank"
                        className="p-4"
                        href={`/${college.CollegeUIConfig[0]?.Slug || "#"}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  )
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="md:col-span-2" data-intro="view-colleges-on-map">
            <CardContent className="pt-6 pb-0">
              <CollegeMap
                colleges={filteredColleges}
                onSelectCollege={(collegeId) => setSelectedCollege(collegeId)}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="w-full" data-intro="browse-courses">
          <CardHeader className="bg-muted p-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-lg sm:text-xl">Browse CPL Courses</div>
              <div className="w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SearchBar
                    onSearch={handleSearch}
                    inputClassName="bg-blue-100"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="w-full overflow-x-auto">
                {selectedCollege ? (
                  <ArticulationsTable
                    articulations={[]}
                    loading={isLoading}
                    error={error}
                    searchTerm={searchTerm}
                    showCollegeName={true}
                    CollegeID={selectedCollege}
                    settingsObject={null}
                    fetchUrl={fetchUrl}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Please select a college from the list to view eligible
                    courses
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SelectedCoursesProvider>
  );
}
