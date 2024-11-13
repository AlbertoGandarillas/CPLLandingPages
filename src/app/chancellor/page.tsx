"use client";
import { useCallback, useState } from "react";
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
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { DropdownIndustryCertifications } from "@/components/shared/DropdownIndustryCertifications";
import { SelectedCoursesProvider } from "@/contexts/SelectedCoursesContext";
import { PotentialSavingsTable } from "@/components/features/chancelor/PotentialSavingsTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { DropdownColleges } from "@/components/shared/DropdownColleges";
import { DropdownMOS } from "@/components/shared/DropdownMOS";

export default function Home() {
  const [open, setOpen] = useState("item-1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>("1");
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);

  const fetchUrl = `/api/cpl-courses?${createQueryString({
    college: selectedCollege ?? undefined,
    industryCertification: selectedIndustryCertification,
    cplType: selectedCPLType ?? undefined,
    learningMode: selectedLearningMode,
    searchTerm: searchTerm.length >= 3 ? searchTerm : undefined,
  })}`;


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
  const handleMOSSelect = (industryCertification: string | null) => {
    setSelectedIndustryCertification(industryCertification);
  };
  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);
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
                    <Info
                      size={16}
                      className="ml-2 cursor-help"
                    />
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <SearchBar
                    onSearch={handleSearch}
                    inputClassName="bg-blue-100"
                  />
                  <DropdownColleges
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
                  <DropdownMOS onMOSSelect={handleMOSSelect} />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="w-full overflow-x-auto">
                <ArticulationsTable
                  articulations={ []}
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
