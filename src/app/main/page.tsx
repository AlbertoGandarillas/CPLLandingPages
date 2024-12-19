"use client";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "intro.js/minified/introjs.min.css";
import { FileText, Award, CheckCircle, ExternalLink, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Certifications } from "@/components/portal/Certifications";
import { usePathname } from "next/navigation";
import { tourSteps } from "@/components/shared/OnBoarding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import SearchBar from "@/components/shared/SearchBar";
import { useFindColleges } from "@/hooks/useFindColleges";
import { LookupColleges, ViewCPLCertificationsByCollege } from "@prisma/client";
import { createQueryString } from "@/lib/createQueryString";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import { DropdownTopCodes } from "@/components/shared/DropdownTopCodes";
import { CollegeFinder } from "@/components/portal/CollegeFinder";
import SelectLearningMode from "@/components/portal/SelectLearningMode";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TopCodeSelection {
  code: string | null;
  title: string | null;
}

// Dynamically import CollegeMap with SSR disabled
const CollegeMap = dynamic(() => import("@/components/portal/CollegeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  ),
});

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedTopCode, setSelectedTopCode] = useState<TopCodeSelection>({
    code: null,
    title: null,
  });
  const [cplType, setCplType] = useState("all");
  const [learningMode, setLearningMode] = useState("all");

  const { data, isLoading, error } = useFindColleges(true); // Always pass true to ignore paging

  const filteredColleges = React.useMemo(() => {
    if (!data) return [];
    const collegesArray = Array.isArray(data) ? data : data.items;
    if (!collegesArray) return [];

    return collegesArray.filter(
      (
        college: LookupColleges & {
          CollegeUIConfig: { Slug: string | null }[];
        } & { CertificationsByCollege: ViewCPLCertificationsByCollege[] }
      ) =>
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

  const [hasShownIntro, setHasShownIntro] = useState(false);
  const pathname = usePathname();
  const localStorageKey = `onboardingEnabled-${pathname}`;

  useEffect(() => {
    if (!hasShownIntro) {
      import("intro.js").then((introJs) => {
        const intro = introJs.default();
        intro.setOptions({
          steps: tourSteps["/main"],
          doneLabel: "Finish",
          exitOnOverlayClick: false,
          exitOnEsc: false,
          showStepNumbers: false,
        });
        intro.oncomplete(() => {
            localStorage.setItem(localStorageKey, "false");
        });
        intro.onbeforechange(async function () {
          const currentStep = intro._currentStep;
          if (currentStep === 5) {
            const courseTab = document.querySelector(
              ".courseTab"
            ) as HTMLElement;
            if (courseTab) {
              courseTab.click();
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve(true);
                }, 1000);
              });
              return true;
            }
          }
          return true;
        });
        intro.start();
        setHasShownIntro(true);
      });
    }
  }, [hasShownIntro]);

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

  return (
    <>
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="bg-muted" data-intro="basic-info">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              What is CPL?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Credit for Prior Learning (CPL) allows students and professionals to
            earn academic credit for knowledge and skills they&apos;ve gained
            outside the classroom, whether through work, military service, or
            other experiences. This tool guides you in identifying eligible
            prior learning and helps you streamline the process of turning that
            experience into recognized credit.
          </CardContent>
        </Card>
        <Card className="bg-muted" data-intro="why-cpl-portfolio">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Why is a CPL portfolio important?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            A CPL portfolio is crucial because it organizes and presents your
            prior learning, skills, and experiences in a structured way that
            colleges can assess for credit. By compiling items like your JST,
            certificates, scores, and resume, the portfolio shows how your
            background meets academic standards, making it easier to receive
            credit when you enroll.
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 mt-4">
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center justify-start">
                  <FileText className="mr-2 h-5 w-5" />
                  Most Common CPL Opportunities
                </div>
                <div>
                  {selectedCollege && (
                    <Badge
                      variant="secondary"
                      className="mt-2 cursor-pointer hover:bg-muted mr-2"
                      onClick={() => setSelectedCollege(null)}
                    >
                      {
                        filteredColleges.find(
                          (college) => college.CollegeID === selectedCollege
                        )?.College
                      }
                      <X className="w-4 h-4 ml-2" />
                    </Badge>
                  )}
                  {selectedTopCode.code && (
                    <Badge
                      variant="secondary"
                      className="mt-2 cursor-pointer hover:bg-muted mr-2"
                      onClick={() =>
                        setSelectedTopCode({ code: null, title: null })
                      }
                    >
                      {selectedTopCode.title}
                      <X className="w-4 h-4 ml-2" />
                    </Badge>
                  )}
                  {learningMode && learningMode !== "all" && (
                    <Badge
                      variant="secondary"
                      className="mt-2 cursor-pointer hover:bg-muted mr-2"
                      onClick={() => setLearningMode("all")}
                    >
                      {learningMode}
                      <X className="w-4 h-4 ml-2" />
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="mt-2 cursor-pointer hover:bg-muted"
                      onClick={() => handleSearch("")}
                    >
                      Search: {searchTerm}
                      <X className="w-4 h-4 ml-2" />
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent data-intro="most-common-cpl-opportunities">
              <div className="flex justify-between items-center gap-4">
                <SelectLearningMode
                  selectedType={learningMode}
                  setSelectedType={setLearningMode}
                  className="w-[500px]"
                />
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search CPL Certifications by name..."
                  className="w-full"
                  value={searchTerm}
                />
                <div data-intro="filter-by-program">
                  <DropdownTopCodes
                    onTopCodeSelect={(selection) =>
                      setSelectedTopCode(selection)
                    }
                    selectedTopCode={selectedTopCode}
                    searchPlaceholder="Filter by Program"
                  />
                </div>
              </div>
              <Tabs defaultValue="exhibit" className="w-full mt-2">
                <TabsList
                  className="grid w-full grid-cols-2"
                  data-intro="exhibit-course-views"
                >
                  <TabsTrigger value="exhibit">Exhibit View</TabsTrigger>
                  <TabsTrigger value="course" className="courseTab">
                    Course View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="exhibit">
                  <Certifications
                    searchTerm={searchTerm}
                    cplType={cplType}
                    learningMode={learningMode}
                  />
                </TabsContent>
                <TabsContent value="course">
                  <SelectedCoursesProvider>
                    <div
                      className="w-full mx-auto p-6 space-y-6"
                      data-intro="college-finder-course-view"
                    >
                      <h2 className="text-2xl">
                        Find CPL Opportunities at California Community Colleges
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CollegeFinder
                          filteredColleges={filteredColleges}
                          selectedCollege={selectedCollege}
                          onSelectCollege={setSelectedCollege}
                          onSearch={(term) => setSearchQuery(term)}
                          onClear={handleSearchClear}
                        />
                        <Card
                          className="md:col-span-2"
                          data-intro="view-colleges-on-map"
                        >
                          <CardContent className="pt-6 pb-0">
                            <CollegeMap
                              colleges={filteredColleges}
                              onSelectCollege={(collegeId) =>
                                setSelectedCollege(collegeId)
                              }
                            />
                          </CardContent>
                        </Card>
                      </div>
                      <Card className="w-full" data-intro="browse-courses">
                        <CardHeader className="bg-muted p-4">
                          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-lg sm:text-xl">
                              Browse CPL Courses{" "}
                              {selectedCollege
                                ? `at ${
                                    filteredColleges.find(
                                      (college) =>
                                        college.CollegeID === selectedCollege
                                    )?.College
                                  }`
                                : ""}
                            </div>
                            <div data-intro="get-cpl-at-your-college">
                              {selectedCollege && (
                                <Link
                                  target="_blank"
                                  className="justify-between flex items-center text-sm gap-4 p-4 bg-primary text-white rounded-md"
                                  href={`/${
                                    filteredColleges.find(
                                      (college) =>
                                        college.CollegeID === selectedCollege
                                    )?.CollegeUIConfig[0]?.Slug || "#"
                                  }`}
                                >
                                  Get CPL at{" "}
                                  {
                                    filteredColleges.find(
                                      (college) =>
                                        college.CollegeID === selectedCollege
                                    )?.College
                                  }
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              )}
                            </div>

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
                                  Please select a college from the list to view
                                  eligible courses
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </SelectedCoursesProvider>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
