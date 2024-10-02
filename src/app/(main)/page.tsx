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
import { PotentialSavings } from "@/components/dashboard/PotentialSavings";
import { DropdownImplementedColleges } from "@/components/shared/DropdownImplementedColleges";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import { DropdownIndustryCertifications } from "@/components/shared/DropdownIndustryCertifications";

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
          throw new Error("Network response was not ok");
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
    <div className="container grid gap-4">
      <Accordion
        type="single"
        value={open}
        onValueChange={setOpen}
        collapsible
        className="mt-4"
      >
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="bg-gray-100 text-3xl text-black p-4 flex justify-">
            <h1 className="text-lg">Welcome</h1>
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p>
                    <strong>
                      Save Time and Money with College Credit for Your Skills
                      and Experience!
                      <br />
                    </strong>
                    You might be able to earn college credit based on what you
                    already know. Check out the list of approved College Prior
                    Learning (CPL) below.
                    <br /> Just enter a keyword to see if you&rsquo;re eligible!
                  </p>
                  <p>
                    <strong>
                      Can&rsquo;t find what you&rsquo;re looking for? No
                      problem!
                    </strong>
                    <br /> You can request a CPL review to see if we can give
                    you credit for your certifications or skills. Here&rsquo;s
                    how to get started:
                    <br /> &nbsp;
                  </p>
                  <p>
                    1. <strong>Apply to the College:</strong>&nbsp;First, go to
                    CCCApply and fill out your application. You&rsquo;ll find
                    the link on the left sidebar.
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
              <PotentialSavings />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Card>
        <CardHeader className="bg-gray-100">
          <CardTitle className="grid grid-cols-2">
            <div className="text-xl">Eligible Courses</div>
            <SearchBar onSearch={setSearchTerm} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ArticulationsTable
            articulations={articulations || []}
            loading={isLoading}
            error={error}
            searchTerm={searchTerm}
            showCollegeName={!selectedCollege || selectedCollege === ""}
          >
            <DropdownImplementedColleges
              onCollegeSelect={handleCollegeSelect}
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
          </ArticulationsTable>
        </CardContent>
      </Card>
    </div>
  );
}
