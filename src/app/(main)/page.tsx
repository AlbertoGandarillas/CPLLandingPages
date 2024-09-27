"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ArticulationsTable from "@/components/features/cpl-courses/ArticulationsTable";
import MainCard from "@/components/shared/MainCard";
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
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
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
            <h1 className="text-lg">Dashboard</h1>
          </AccordionTrigger>
          <AccordionContent>
                  <PotentialSavings />
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
