"use client";
import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";

export default function Home({ params }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | undefined>(
    undefined
  );
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
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
  const {
    data: articulations,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["articulations", selectedCollege, selectedIndustryCertification],
    queryFn: () =>
      fetch(
        `/api/cpl-courses?${createQueryString({
          college: selectedCollege,
          industryCertification: selectedIndustryCertification,
        })}`
      ).then((res) => {
      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(`API error: ${res.status}`);
      }
        return res.json();
      }),
  });
  const settingsObject = settings && settings.length > 0 ? settings[0] : null;

  useEffect(() => {
    if (settingsObject && settingsObject.College?.College) {
      setSelectedCollege(settingsObject.CollegeID);
    }
  }, [settingsObject]);

  if (settingsLoading) return <SkeletonWrapper isLoading={settingsLoading} count={2} variant="table" fullWidth />;
  if (settingsError) return <div>Error loading settings</div>;
  if (!settingsObject) {
    return <NotFoundPage/>;
  }
  const appName = `${process.env.NEXT_PUBLIC_APP_NAME}`;
  const appCopyright = `${process.env.NEXT_PUBLIC_APP_COPYRIGHT}`;

  return (
    <SelectedCoursesProvider>
      <div className="flex flex-col min-h-screen">
        <div
          className="flex flex-1"
          style={{
            backgroundColor: settingsObject.BodyBackground,
            color: settingsObject.BodyFontColor,
          }}
        >
          <Sidebar
            settingsObject={settingsObject}
            onIndustryCertificationSelect={handleIndustryCertificationSelect}
            className=""
          >
            <SelectedCoursesList
              articulations={articulations || []}
              CollegeID={selectedCollege || ""}
            />
          </Sidebar>
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
                  <CardTitle className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
                    <div className="text-md text-center lg:text-left text-lg">
                      Courses below are approved for credit based on prior
                      learning
                    </div>
                    <SearchBar
                      className="w-full lg:w-96"
                      onSearch={setSearchTerm}
                    />
                    <DropdownIndustryCertifications
                      onIndustryCertificationSelect={
                        handleIndustryCertificationSelect
                      }
                      collegeId={selectedCollege}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ArticulationsTable
                    articulations={articulations || []}
                    loading={isLoading}
                    error={error}
                    searchTerm={searchTerm}
                    CPLAssistantEmail={settingsObject.Email}
                    CollegeID={settingsObject.CollegeID}
                    settingsObject={settingsObject}
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