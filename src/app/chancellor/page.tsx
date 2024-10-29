"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { DropdownImplementedColleges } from "@/components/shared/DropdownImplementedColleges";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { DropdownIndustryCertifications } from "@/components/shared/DropdownIndustryCertifications";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import { PotentialSavingsTable } from "@/components/features/chancelor/PotentialSavingsTable";

export default function Home() {
  const [open, setOpen] = useState("item-1");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>("1");
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const {
    data: articulations,
    error,
    isLoading,
  } = useQuery({
    queryKey: [
      "articulations",
      selectedCollege,
      selectedIndustryCertification,
      selectedCPLType,
      selectedLearningMode,
    ],
    queryFn: () =>
      fetch(
        `/api/cpl-courses?${createQueryString({
          college: selectedCollege ?? undefined,
          industryCertification: selectedIndustryCertification,
          cplType: selectedCPLType ?? undefined,
          learningMode: selectedLearningMode,
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

  const handleCollegeSelect = (collegeId: string | null) => {
    setSelectedCollege(collegeId);
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
  return (
    <SelectedCoursesProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Accordion
          type="single"
          value={open}
          onValueChange={setOpen}
          collapsible
          className="mt-4 w-full"
        >
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="bg-gray-100 text-black p-4 w-full">
              <h1 className="text-base sm:text-lg font-medium text-left">
                Potential CPL Savings & Preservation of Funds, 20-Year Impact,
                College Metrics
              </h1>
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
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Card className="w-full">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="hidden text-lg sm:text-xl">Eligible Courses</div>
              <div className="w-full sm:w-auto">
                <div className="flex sm:flex-row gap-4">
                <SearchBar onSearch={setSearchTerm} />
                  <DropdownImplementedColleges
                    onCollegeSelect={handleCollegeSelect}
                    selectedCollege={selectedCollege}
                  />
                  {selectedCollege && (
                    <DropdownIndustryCertifications
                      onIndustryCertificationSelect={
                        handleIndustryCertificationSelect
                      }
                      collegeId={selectedCollege}
                    />
                  )}
                  <DropdownCPLTypes onCPLTypeSelect={handleCPLTypeSelect} />
                  <DropdownLearningModes
                    onLearningModeSelect={handleLerningModeSelect}
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="w-full overflow-x-auto">
                <ArticulationsTable
                  articulations={articulations || []}
                  loading={isLoading}
                  error={error}
                  searchTerm={searchTerm}
                  showCollegeName={!selectedCollege || selectedCollege === ""}
                  CollegeID={
                    selectedCollege ? parseInt(selectedCollege, 10) : 1
                  }
                  settingsObject={null}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SelectedCoursesProvider>
  );
}
