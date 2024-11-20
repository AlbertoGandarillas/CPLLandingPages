"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFindColleges } from "@/hooks/useFindColleges";
import { LookupColleges } from "@prisma/client";
import SearchBar from "@/components/shared/SearchBar";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import { useCallback, useState } from "react";
import { createQueryString } from "@/lib/createQueryString";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
// Dynamically import the map component with SSR disabled
const CollegeMap = dynamic(() => import("@/components/portal/CollegeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  ),
});

type College = LookupColleges;

export default function FindAMapCollege() {
  const [searchQuery, setSearchQuery] = useState("");
  const ignorePaging = true;
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const { data, isLoading, error } = useFindColleges(ignorePaging);
  const filteredColleges =
    data?.filter(
      (college) =>
        college.College.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.City?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.ZipCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.StateCode?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  const fetchUrl = `/api/cpl-courses?${createQueryString({
    college: selectedCollege ?? undefined,
    searchTerm: searchTerm.length >= 3 ? searchTerm : undefined,
  })}`;
  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);
  return (
    <SelectedCoursesProvider>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Find a MAP College</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>College Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchBar
                onSearch={(term) => setSearchQuery(term)}
                placeholder="Search colleges by name, city, or zip code..."
                className="mb-4"
              />
              <ScrollArea className="h-[500px]">
                {filteredColleges.map((college, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left mb-2"
                    onClick={() =>
                      setSelectedCollege(college.CollegeID.toString())
                    }
                  >
                    <div>
                      <div className="font-semibold">{college.College}</div>
                      <div className="text-sm text-muted-foreground">
                        {college.City}, {college.StateCode} {college.ZipCode}
                      </div>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent>
              <CardContent className="p-0">
                <CollegeMap colleges={filteredColleges} />
              </CardContent>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="hidden text-lg sm:text-xl">Eligible Courses</div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </SelectedCoursesProvider>
  );
}
