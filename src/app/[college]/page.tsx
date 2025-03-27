"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { type SearchBarRef } from "@/components/shared/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { createQueryString } from "@/lib/createQueryString";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import SearchBar from "@/components/shared/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Sidebar from "@/components/layout/Sidebar";
import { DropdownIndustryCertifications } from "@/components/shared/DropdownIndustryCertifications";
import SelectedCoursesList from "@/components/features/cpl-courses/SelectedCoursesList";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import NotFoundPage from "../not-found";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { useTheme } from "next-themes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { Link, Menu, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home({ params }: any) {
  const { setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const searchBarRef = useRef<SearchBarRef>(null);
  const [open, setOpen] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | undefined>(
    undefined
  );
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);

  // Set theme to light on component mount
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const handleIndustryCertificationSelect = (
    industryCertification: string | null
  ) => {
    setSelectedIndustryCertification(industryCertification);
  };
  const {
    data: settings,
    error: settingsError,
    isLoading: settingsLoading,
  } = useQuery({
    queryKey: ["ui-settings", params.college],
    queryFn: () =>
      fetch(`/api/ui-settings/${params.college}`).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();        
      }),
  });

  const fetchUrl = `/api/cpl-courses?${createQueryString({
    college: selectedCollege,
    industryCertification: selectedIndustryCertification,
    learningMode: selectedLearningMode,
    searchTerm: searchTerm.length >= 3 ? searchTerm : undefined
  })}`;

  const settingsObject = settings && settings.length > 0 ? settings[0] : null;

  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);

  const handleLerningModeSelect = (learningMode: string | null) => {
    setSelectedLearningMode(learningMode);
  };

  const handleClearFilters = () => {
    setSelectedLearningMode(null);
    setSelectedIndustryCertification(null);
    setSearchTerm("");
    searchBarRef.current?.clear();
  };

  useEffect(() => {
    if (settingsObject && settingsObject.College?.College) {
      setSelectedCollege(settingsObject.CollegeID);
    }
  }, [settingsObject]);

  if (settingsLoading)
    return (
      <SkeletonWrapper
        isLoading={settingsLoading}
        count={2}
        variant="table"
        fullWidth
      />
    );
  if (settingsError) return <div>Error loading settings</div>;
  if (!settingsObject) {
    return <NotFoundPage />;
  }
  const appName = `${process.env.NEXT_PUBLIC_APP_NAME}`;
  const appCopyright = `${process.env.NEXT_PUBLIC_APP_COPYRIGHT}`;

  return (
    <SelectedCoursesProvider>
      <div className="flex flex-col min-h-screen">
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-[#9f9fa0] text-white hover:bg-[#8a8a8a]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
              <Sidebar
                settingsObject={settingsObject}
                onIndustryCertificationSelect={
                  handleIndustryCertificationSelect
                }
                className="h-full"
              >
                <SelectedCoursesList CollegeID={selectedCollege || ""} />
              </Sidebar>
            </SheetContent>
          </Sheet>
        </div>

        <div
          className="flex flex-1"
          style={{
            backgroundColor: settingsObject.BodyBackground,
            color: settingsObject.BodyFontColor,
          }}
        >
          <div className="hidden md:block">
            <Sidebar
              settingsObject={settingsObject}
              onIndustryCertificationSelect={handleIndustryCertificationSelect}
              className=""
            >
              <SelectedCoursesList CollegeID={selectedCollege || ""} />
            </Sidebar>
          </div>
          <main className="flex-1 p-4">
            <Accordion
              type="single"
              value={open}
              onValueChange={setOpen}
              collapsible
            >
              <AccordionItem value="item-1" className="border-r-4">
                <AccordionTrigger className=" bg-gray-100 text-3xl text-black p-4 flex justify-">
                  <div></div>
                  <h1>{appName}</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader className="bg-white"></CardHeader>
                    <CardContent className="max-h-[350px] text-center overflow-y-auto">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: settingsObject.WebsiteText,
                        }}
                      />
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-4">
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="flex flex-col space-y-4">
                    <div className="text-sm sm:text-md md:text-lg text-center">
                      Courses below are approved for credit based on prior
                      learning
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <SearchBar
                        className="w-full lg:flex-1" 
                        onSearch={handleSearch}
                        ref={searchBarRef}
                      />
                      <DropdownIndustryCertifications
                        onIndustryCertificationSelect={
                          handleIndustryCertificationSelect
                        }
                        collegeId={selectedCollege}
                        selectedIndustryCertification={
                          selectedIndustryCertification
                        }
                        className="w-full lg:flex-1"
                      />
                      <DropdownLearningModes
                        onLearningModeSelect={setSelectedLearningMode}
                        selectedMode={selectedLearningMode}
                        className="w-full lg:flex-1"
                      />
                      <Button
                        variant="secondary"
                        onClick={handleClearFilters}
                        className="w-full lg:flex-1"
                      >
                        <Trash className="h-4 w-4 mr-2" /> Clear Filters
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ArticulationsTable
                    articulations={[]}
                    loading={false}
                    error={null}
                    searchTerm={searchTerm}
                    CPLAssistantEmail={settingsObject.Email}
                    CollegeID={settingsObject.CollegeID}
                    settingsObject={settingsObject}
                    fetchUrl={fetchUrl}
                    columnsToHide={["College"]}
                  ></ArticulationsTable>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        <footer
          className=" text-white text-center p-4 mt-auto"
          style={{
            backgroundColor: settingsObject.HeaderBackgroundColor,
            color: settingsObject.HeaderFontColor,
          }}
        >
          <p>{appCopyright}</p>
        </footer>
      </div>
    </SelectedCoursesProvider>
  );
}
